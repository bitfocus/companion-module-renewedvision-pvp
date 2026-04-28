"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylists = getPlaylists;
exports.getLayers = getLayers;
exports.getTransportState = getTransportState;
exports.getPvpState = getPvpState;
exports.getPvpLiveState = getPvpLiveState;
function buildBaseUrl(config) {
    const parsedHost = parseHost(config.host);
    const scheme = parsedHost.scheme ?? (config.useHttps ? 'https' : 'http');
    const port = parsedHost.port ?? config.port;
    return `${scheme}://${parsedHost.host}:${port}/api/0`;
}
async function fetchJson(config, secrets, path) {
    const headers = {
        Accept: 'application/json',
    };
    if (secrets.token) {
        headers.Authorization = `Bearer ${secrets.token}`;
    }
    const url = `${buildBaseUrl(config)}${path}`;
    let response;
    try {
        response = await fetch(url, {
            method: 'GET',
            headers,
        });
    }
    catch (error) {
        throw new Error(`PVP API request failed before response: ${url} (${formatErrorWithCause(error)})`);
    }
    if (!response.ok) {
        throw new Error(`PVP API request failed ${response.status} ${response.statusText}: ${url}`);
    }
    return (await response.json());
}
async function fetchOptionalJson(config, secrets, path) {
    try {
        return await fetchJson(config, secrets, path);
    }
    catch (_error) {
        return undefined;
    }
}
function parseHost(host) {
    const trimmed = host.trim();
    const hostWithScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    try {
        const parsed = new URL(hostWithScheme);
        const scheme = parsed.protocol === 'http:' ? 'http' : parsed.protocol === 'https:' ? 'https' : undefined;
        const port = parsed.port ? Number(parsed.port) : undefined;
        return {
            host: parsed.hostname,
            port: Number.isFinite(port) ? port : undefined,
            scheme,
        };
    }
    catch (_error) {
        return { host: trimmed.replace(/^https?:\/\//i, '').replace(/\/.*$/, '') };
    }
}
function formatErrorWithCause(error) {
    if (!(error instanceof Error))
        return String(error);
    const cause = error.cause;
    if (cause instanceof Error)
        return `${error.message}: ${cause.message}`;
    if (cause)
        return `${error.message}: ${String(cause)}`;
    return error.message;
}
async function getPlaylists(config, secrets) {
    const payload = await fetchJson(config, secrets, '/data/playlists');
    const rootPlaylist = getRecordProperty(payload, 'playlist');
    return flattenPlaylists(rootPlaylist);
}
async function getLayers(config, secrets) {
    const payload = await fetchJson(config, secrets, '/data/layers');
    if (!isRecord(payload) || !Array.isArray(payload.data))
        return [];
    return payload.data
        .map((entry) => normalizeLayer(getRecordProperty(entry, 'layer')))
        .filter((layer) => layer !== undefined);
}
async function getTransportState(config, secrets) {
    const payload = await fetchJson(config, secrets, '/transportState/workspace');
    if (isRecord(payload) && Array.isArray(payload.data)) {
        return payload.data
            .map((entry) => normalizeTransportState(getRecordProperty(entry, 'transportState')))
            .filter((state) => state !== undefined);
    }
    const wrappedState = normalizeTransportState(getRecordProperty(payload, 'transportState'));
    if (wrappedState)
        return [wrappedState];
    const directState = normalizeTransportState(payload);
    return directState ? [directState] : [];
}
async function getPvpState(config, secrets) {
    const [playlists, baseLayers, workspaceTransport, targetSets, blendModes, layerPresets, effectPresets, transitions, availableEffects, workspaceEffects, workspaceEffectPreset, workspaceTransition, workspaceTransitionDuration,] = await Promise.all([
        getPlaylists(config, secrets),
        getLayers(config, secrets),
        getTransportState(config, secrets),
        getTargetSets(config, secrets),
        getBlendModes(config, secrets),
        getLayerPresets(config, secrets),
        getEffectPresets(config, secrets),
        getAvailableTransitions(config, secrets),
        getAvailableEffects(config, secrets),
        getWorkspaceEffects(config, secrets),
        getWorkspaceEffectPreset(config, secrets),
        getWorkspaceTransition(config, secrets),
        getWorkspaceTransitionDuration(config, secrets),
    ]);
    const targetSetNames = new Map(targetSets.map((targetSet) => [targetSet.uuid, targetSet.name]));
    const effectPresetNames = new Map(effectPresets.map((preset) => [preset.uuid, preset.name]));
    const enrichedLayers = await Promise.all(baseLayers.map((layer, layerIndex) => enrichLayer(config, secrets, layer, layerIndex, targetSetNames, effectPresetNames, blendModes)));
    return {
        playlists,
        layers: enrichedLayers,
        workspaceTransport: workspaceTransport.map((transport) => ({
            ...transport,
            layer: transport.layer
                ? enrichTransportLayer(transport.layer, enrichedLayers, targetSetNames, effectPresetNames)
                : undefined,
        })),
        workspaceEffects,
        workspaceEffectPreset,
        workspaceTransition,
        workspaceTransitionDuration,
        targetSets,
        blendModes,
        layerPresets,
        effectPresets,
        transitions,
        availableEffects,
        lastPollTime: new Date().toISOString(),
    };
}
async function getPvpLiveState(config, secrets, previousState) {
    const [playlists, baseLayers, workspaceTransport] = await Promise.all([
        getPlaylists(config, secrets),
        getLayers(config, secrets),
        getTransportState(config, secrets),
    ]);
    const enrichedLayers = baseLayers.map((layer) => mergeLayerWithPrevious(layer, previousState));
    return {
        ...previousState,
        playlists,
        layers: enrichedLayers,
        workspaceTransport: workspaceTransport.map((transport) => ({
            ...transport,
            layer: transport.layer
                ? enrichTransportLayer(transport.layer, enrichedLayers, new Map(previousState.targetSets.map((targetSet) => [targetSet.uuid, targetSet.name])), new Map(previousState.effectPresets.map((preset) => [preset.uuid, preset.name])))
                : undefined,
        })),
        lastPollTime: new Date().toISOString(),
        lastPollError: undefined,
    };
}
function mergeLayerWithPrevious(layer, previousState) {
    const previousLayer = previousState.layers.find((candidate) => candidate.uuid && candidate.uuid === layer.uuid);
    if (!previousLayer)
        return layer;
    return {
        ...layer,
        targetSetName: layer.targetSetName ?? previousLayer.targetSetName,
        effectPresetName: layer.effectPresetName ?? previousLayer.effectPresetName,
        layerPresetName: layer.layerPresetName ?? previousLayer.layerPresetName,
        layerPresetId: layer.layerPresetId ?? previousLayer.layerPresetId,
        blendMode: layer.blendMode ?? previousLayer.blendMode,
        blend: layer.blend ?? previousLayer.blend,
        transition: layer.transition ?? previousLayer.transition,
        transitionDuration: layer.transitionDuration ?? previousLayer.transitionDuration,
    };
}
async function getTargetSets(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/targetSet');
    return parseDataArray(payload, 'targetSet', normalizeNamedUuid);
}
async function getBlendModes(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/blendMode');
    return parseDataArray(payload, 'blendMode', normalizeBlendMode);
}
async function getLayerPresets(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/layerPreset');
    return parseDataArray(payload, undefined, normalizeNamedId);
}
async function getEffectPresets(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/effectsPreset');
    return parseDataArray(payload, 'effectPreset', normalizeEffectPreset);
}
async function getAvailableTransitions(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/transition');
    return parseDataArray(payload, 'transition', normalizeTransition);
}
async function getAvailableEffects(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/effects');
    return parseDataArray(payload, 'effect', normalizeEffect);
}
async function getWorkspaceEffects(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/effects/workspace');
    return parseDataArray(payload, 'effect', normalizeEffect);
}
async function getWorkspaceEffectPreset(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/effectsPreset/workspace');
    return normalizeEffectPreset(getRecordProperty(payload, 'effectPreset'));
}
async function getWorkspaceTransition(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/transition/workspace');
    return normalizeTransition(getRecordProperty(payload, 'transition'));
}
async function getWorkspaceTransitionDuration(config, secrets) {
    const payload = await fetchOptionalJson(config, secrets, '/transitionDuration/workspace');
    const transitionDuration = getRecordProperty(payload, 'transitionDuration');
    return isRecord(transitionDuration) ? getOptionalNumberProperty(transitionDuration, 'value') : undefined;
}
async function enrichLayer(config, secrets, layer, layerIndex, targetSetNames, effectPresetNames, blendModes) {
    const [targetSet, blendMode, blend, layerPreset, effectPreset, transition, transitionDuration] = await Promise.all([
        getLayerTargetSet(config, secrets, layerIndex),
        getLayerBlendMode(config, secrets, layerIndex),
        getLayerBlend(config, secrets, layerIndex, blendModes),
        getLayerPreset(config, secrets, layerIndex),
        getLayerEffectPreset(config, secrets, layerIndex),
        getLayerTransition(config, secrets, layerIndex),
        getLayerTransitionDuration(config, secrets, layerIndex),
    ]);
    return {
        ...layer,
        targetSetName: targetSet?.name ?? targetSetNames.get(layer.targetSetUUID),
        effectPresetName: effectPreset?.name ?? effectPresetNames.get(layer.effectPresetUUID),
        layerPresetName: layerPreset?.name,
        layerPresetId: layerPreset?.id,
        blendMode,
        blend,
        transition: transition ?? layer.transition,
        transitionDuration: transitionDuration ?? layer.transitionDuration,
    };
}
function enrichTransportLayer(layer, layers, targetSetNames, effectPresetNames) {
    const matchingLayer = layers.find((candidate) => candidate.uuid && candidate.uuid === layer.uuid);
    return {
        ...layer,
        targetSetName: matchingLayer?.targetSetName ?? targetSetNames.get(layer.targetSetUUID),
        effectPresetName: matchingLayer?.effectPresetName ?? effectPresetNames.get(layer.effectPresetUUID),
        layerPresetName: matchingLayer?.layerPresetName,
        layerPresetId: matchingLayer?.layerPresetId,
        blendMode: matchingLayer?.blendMode,
        blend: matchingLayer?.blend,
        transition: layer.transition ?? matchingLayer?.transition,
        transitionDuration: layer.transitionDuration ?? matchingLayer?.transitionDuration,
    };
}
async function getLayerTargetSet(config, secrets, layerIndex) {
    const payload = await fetchOptionalJson(config, secrets, `/targetSet/layer/${layerIndex}`);
    return normalizeNamedUuid(getRecordProperty(payload, 'targetSet'));
}
async function getLayerBlendMode(config, secrets, layerIndex) {
    const payload = await fetchOptionalJson(config, secrets, `/blendMode/layer/${layerIndex}`);
    return normalizeBlendMode(getRecordProperty(payload, 'blendMode'));
}
async function getLayerBlend(config, secrets, layerIndex, blendModes) {
    const payload = await fetchOptionalJson(config, secrets, `/blend/layer/${layerIndex}`);
    const layerBlend = normalizeLayerBlend(getRecordProperty(payload, 'layerBlend') ?? payload);
    if (!layerBlend?.modeName && layerBlend?.modeIndex !== undefined) {
        layerBlend.modeName = blendModes.find((blendMode) => blendMode.id === layerBlend.modeIndex)?.name;
    }
    return layerBlend;
}
async function getLayerPreset(config, secrets, layerIndex) {
    const payload = await fetchOptionalJson(config, secrets, `/layerPreset/layer/${layerIndex}`);
    return parseDataArray(payload, undefined, normalizeNamedId)[0] ?? normalizeNamedId(payload);
}
async function getLayerEffectPreset(config, secrets, layerIndex) {
    const payload = await fetchOptionalJson(config, secrets, `/effectsPreset/layer/${layerIndex}`);
    return normalizeEffectPreset(getRecordProperty(payload, 'effectPreset'));
}
async function getLayerTransition(config, secrets, layerIndex) {
    const payload = await fetchOptionalJson(config, secrets, `/transition/layer/${layerIndex}`);
    return normalizeTransition(getRecordProperty(payload, 'transition'));
}
async function getLayerTransitionDuration(config, secrets, layerIndex) {
    const payload = await fetchOptionalJson(config, secrets, `/transitionDuration/layer/${layerIndex}`);
    const transitionDuration = getRecordProperty(payload, 'transitionDuration');
    return isRecord(transitionDuration) ? getOptionalNumberProperty(transitionDuration, 'value') : undefined;
}
function flattenPlaylists(rootPlaylist) {
    const playlists = [];
    function walk(node, path) {
        if (!isRecord(node))
            return;
        const name = getStringProperty(node, 'name', 'Playlist');
        const uuid = getStringProperty(node, 'uuid', '');
        const isRoot = name === 'Root' && path.length === 0;
        const currentPath = isRoot ? path : [...path, name];
        const items = Array.isArray(node.items) ? node.items.map(normalizeCue) : [];
        const children = Array.isArray(node.children) ? node.children : [];
        if (!isRoot) {
            playlists.push({
                uuid,
                name,
                path: currentPath.join(' / '),
                items,
                childCount: children.length,
                isVideoInput: name === 'Video Input',
            });
        }
        children.forEach((child) => walk(child, currentPath));
    }
    walk(rootPlaylist, []);
    return playlists;
}
function normalizeCue(cue) {
    if (!isRecord(cue)) {
        return { uuid: '', name: '' };
    }
    return {
        uuid: getStringProperty(cue, 'uuid', ''),
        name: getStringProperty(cue, 'name', ''),
    };
}
function normalizeTransportState(state) {
    if (!isRecord(state))
        return undefined;
    const playingItem = getRecordProperty(state, 'playingItem');
    const playingMedia = getRecordProperty(state, 'playingMedia');
    const layer = getRecordProperty(state, 'layer');
    const normalizedLayer = normalizeLayer(layer);
    return {
        timeElapsed: getOptionalNumberProperty(state, 'timeElapsed'),
        timeRemaining: getOptionalNumberProperty(state, 'timeRemaining'),
        playbackRate: getOptionalNumberProperty(state, 'playbackRate'),
        isScrubbing: getOptionalBooleanProperty(state, 'isScrubbing'),
        isPlaying: getOptionalBooleanProperty(state, 'isPlaying'),
        playingItem: isRecord(playingItem)
            ? {
                uuid: getOptionalStringProperty(playingItem, 'uuid'),
                name: getOptionalStringProperty(playingItem, 'name'),
            }
            : undefined,
        playingMedia: isRecord(playingMedia)
            ? {
                uuid: getOptionalStringProperty(playingMedia, 'uuid'),
                name: getOptionalStringProperty(playingMedia, 'name'),
            }
            : undefined,
        layer: normalizedLayer,
    };
}
function normalizeLayer(layer) {
    if (!isRecord(layer))
        return undefined;
    const transition = normalizeTransition(getRecordProperty(layer, 'transition'));
    return {
        uuid: getOptionalStringProperty(layer, 'uuid'),
        name: getOptionalStringProperty(layer, 'name'),
        isHidden: getOptionalBooleanProperty(layer, 'isHidden'),
        isMuted: getOptionalBooleanProperty(layer, 'isMuted'),
        opacity: getOptionalNumberProperty(layer, 'opacity'),
        targetSetUUID: getOptionalStringProperty(layer, 'targetSetUUID'),
        targetSetName: getOptionalStringProperty(layer, 'targetSetName'),
        effectPresetUUID: getOptionalStringProperty(layer, 'effectPresetUUID'),
        effectPresetName: getOptionalStringProperty(layer, 'effectPresetName'),
        layerPresetName: getOptionalStringProperty(layer, 'layerPresetName'),
        layerPresetId: getOptionalStringOrNumberProperty(layer, 'layerPresetId'),
        blendMode: normalizeBlendMode(getRecordProperty(layer, 'blendMode')),
        blend: normalizeLayerBlend(getRecordProperty(layer, 'blend')),
        transitionDuration: getOptionalNumberProperty(layer, 'transitionDuration'),
        transition,
        effects: Array.isArray(layer.effects)
            ? layer.effects
                .map((effect) => normalizeEffect(effect))
                .filter((effect) => effect !== undefined)
            : [],
    };
}
function normalizeTransition(transition) {
    if (!isRecord(transition))
        return undefined;
    return {
        uuid: getOptionalStringProperty(transition, 'uuid'),
        name: getOptionalStringProperty(transition, 'name'),
        enabled: getOptionalBooleanProperty(transition, 'enabled'),
        variables: Array.isArray(transition.variables)
            ? transition.variables
                .map((variable) => normalizeEffectVariable(variable))
                .filter((variable) => variable !== undefined)
            : [],
    };
}
function normalizeEffect(effect) {
    if (!isRecord(effect))
        return undefined;
    return {
        uuid: getOptionalStringProperty(effect, 'uuid'),
        name: getOptionalStringProperty(effect, 'name'),
        enabled: getOptionalBooleanProperty(effect, 'enabled'),
        variables: Array.isArray(effect.variables)
            ? effect.variables
                .map((variable) => normalizeEffectVariable(variable))
                .filter((variable) => variable !== undefined)
            : [],
    };
}
function normalizeEffectVariable(variable) {
    if (!isRecord(variable))
        return undefined;
    const base = getRecordProperty(variable, 'base');
    if (!isRecord(base))
        return undefined;
    return {
        name: getOptionalStringProperty(base, 'name'),
        type: getOptionalStringProperty(variable, 'type'),
        value: getOptionalScalarProperty(base, 'value') ?? getOptionalStringProperty(base, 'color'),
        min: getOptionalNumberProperty(base, 'min_value'),
        max: getOptionalNumberProperty(base, 'max_value'),
        color: getOptionalStringProperty(base, 'color'),
        default: getOptionalScalarProperty(base, 'default'),
    };
}
function normalizeNamedUuid(value) {
    if (!isRecord(value))
        return undefined;
    return {
        uuid: getOptionalStringProperty(value, 'uuid'),
        name: getOptionalStringProperty(value, 'name'),
    };
}
function normalizeNamedId(value) {
    if (!isRecord(value))
        return undefined;
    return {
        id: getOptionalStringOrNumberProperty(value, 'id'),
        name: getOptionalStringProperty(value, 'name'),
    };
}
function normalizeBlendMode(value) {
    if (!isRecord(value))
        return undefined;
    return {
        id: getOptionalNumberProperty(value, 'id'),
        name: getOptionalStringProperty(value, 'name'),
    };
}
function normalizeLayerBlend(value) {
    if (!isRecord(value))
        return undefined;
    const base = getRecordProperty(value, 'base');
    const baseRecord = isRecord(base) ? base : {};
    return {
        type: getOptionalStringProperty(value, 'type'),
        modeIndex: getOptionalNumberProperty(baseRecord, 'modeIndex'),
        modeName: getOptionalStringProperty(baseRecord, 'name'),
        opacity: getOptionalNumberProperty(baseRecord, 'opacity'),
        isInverted: getOptionalBooleanProperty(baseRecord, 'isInverted'),
    };
}
function normalizeEffectPreset(value) {
    if (!isRecord(value))
        return undefined;
    return {
        uuid: getOptionalStringProperty(value, 'uuid'),
        name: getOptionalStringProperty(value, 'name'),
        effects: Array.isArray(value.effects)
            ? value.effects
                .map((effect) => normalizeEffect(effect))
                .filter((effect) => effect !== undefined)
            : [],
    };
}
function parseDataArray(payload, wrapperKey, normalize) {
    if (!isRecord(payload) || !Array.isArray(payload.data))
        return [];
    return payload.data
        .map((entry) => normalize(wrapperKey ? getRecordProperty(entry, wrapperKey) : entry))
        .filter((entry) => entry !== undefined);
}
function getRecordProperty(value, key) {
    return isRecord(value) ? value[key] : undefined;
}
function getStringProperty(value, key, fallback) {
    return typeof value[key] === 'string' ? value[key] : fallback;
}
function getOptionalStringProperty(value, key) {
    return typeof value[key] === 'string' ? value[key] : undefined;
}
function getOptionalNumberProperty(value, key) {
    return typeof value[key] === 'number' ? value[key] : undefined;
}
function getOptionalBooleanProperty(value, key) {
    return typeof value[key] === 'boolean' ? value[key] : undefined;
}
function getOptionalScalarProperty(value, key) {
    const property = value[key];
    return typeof property === 'string' || typeof property === 'number' || typeof property === 'boolean'
        ? property
        : undefined;
}
function getOptionalStringOrNumberProperty(value, key) {
    const property = value[key];
    return typeof property === 'string' || typeof property === 'number' ? property : undefined;
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
