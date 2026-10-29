"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEEDBACK_ID_LAYER_PLAYBACK_RATE_COMPARE = exports.FEEDBACK_ID_LAYER_IS_SCRUBBING = exports.FEEDBACK_ID_LAYER_IS_PLAYING = exports.FEEDBACK_ID_LAYER_TIME_REMAINING_COMPARE = exports.FEEDBACK_ID_LAYER_PLAYING_MEDIA_IS = exports.FEEDBACK_ID_LAYER_PLAYING_ITEM_IS = exports.FEEDBACK_ID_LAYER_TRANSITION_DURATION_COMPARE = exports.FEEDBACK_ID_LAYER_TRANSITION_IS = exports.FEEDBACK_ID_LAYER_EFFECT_IS_ACTIVE = exports.FEEDBACK_ID_LAYER_EFFECT_PRESET_IS = exports.FEEDBACK_ID_LAYER_TARGET_SET_IS = exports.FEEDBACK_ID_LAYER_OPACITY_COMPARE = exports.FEEDBACK_ID_LAYER_IS_HIDDEN = exports.FEEDBACK_ID_LAYER_IS_MUTED = exports.FEEDBACK_ID_LAYER_IS_ACTIVE = exports.FEEDBACK_ID_PLAYLIST_IS_ACTIVE = exports.FEEDBACK_ID_CUE_IS_ACTIVE = exports.FEEDBACK_ID_CATALOG_CONDITION = exports.FEEDBACK_ID_EFFECT_CONDITION = exports.FEEDBACK_ID_WORKSPACE_CONDITION = exports.FEEDBACK_ID_TRANSPORT_CONDITION = exports.FEEDBACK_ID_LAYER_CONDITION = exports.FEEDBACK_ID_CUE_CONDITION = exports.FEEDBACK_ID_PLAYLIST_CONDITION = void 0;
exports.getFeedbackDefinitions = getFeedbackDefinitions;
exports.FEEDBACK_ID_PLAYLIST_CONDITION = 'playlist_condition';
exports.FEEDBACK_ID_CUE_CONDITION = 'cue_condition';
exports.FEEDBACK_ID_LAYER_CONDITION = 'layer_condition';
exports.FEEDBACK_ID_TRANSPORT_CONDITION = 'transport_condition';
exports.FEEDBACK_ID_WORKSPACE_CONDITION = 'workspace_condition';
exports.FEEDBACK_ID_EFFECT_CONDITION = 'effect_condition';
exports.FEEDBACK_ID_CATALOG_CONDITION = 'catalog_condition';
exports.FEEDBACK_ID_CUE_IS_ACTIVE = 'cue_is_active';
exports.FEEDBACK_ID_PLAYLIST_IS_ACTIVE = 'playlist_is_active';
exports.FEEDBACK_ID_LAYER_IS_ACTIVE = 'layer_is_active';
exports.FEEDBACK_ID_LAYER_IS_MUTED = 'layer_is_muted';
exports.FEEDBACK_ID_LAYER_IS_HIDDEN = 'layer_is_hidden';
exports.FEEDBACK_ID_LAYER_OPACITY_COMPARE = 'layer_opacity_compare';
exports.FEEDBACK_ID_LAYER_TARGET_SET_IS = 'layer_target_set_is';
exports.FEEDBACK_ID_LAYER_EFFECT_PRESET_IS = 'layer_effect_preset_is';
exports.FEEDBACK_ID_LAYER_EFFECT_IS_ACTIVE = 'layer_effect_is_active';
exports.FEEDBACK_ID_LAYER_TRANSITION_IS = 'layer_transition_is';
exports.FEEDBACK_ID_LAYER_TRANSITION_DURATION_COMPARE = 'layer_transition_duration_compare';
exports.FEEDBACK_ID_LAYER_PLAYING_ITEM_IS = 'layer_playing_item_is';
exports.FEEDBACK_ID_LAYER_PLAYING_MEDIA_IS = 'layer_playing_media_is';
exports.FEEDBACK_ID_LAYER_TIME_REMAINING_COMPARE = 'layer_time_remaining_compare';
exports.FEEDBACK_ID_LAYER_IS_PLAYING = 'layer_is_playing';
exports.FEEDBACK_ID_LAYER_IS_SCRUBBING = 'layer_is_scrubbing';
exports.FEEDBACK_ID_LAYER_PLAYBACK_RATE_COMPARE = 'layer_playback_rate_compare';
const COMPARE_CHOICES = [
    { id: 'eq', label: '=' },
    { id: 'ne', label: '!=' },
    { id: 'contains', label: 'contains' },
    { id: 'not_contains', label: 'does not contain' },
    { id: 'gt', label: '>' },
    { id: 'gte', label: '>=' },
    { id: 'lt', label: '<' },
    { id: 'lte', label: '<=' },
    { id: 'truthy', label: 'is true/yes' },
    { id: 'falsy', label: 'is false/no' },
];
const PLAYLIST_FIELD_CHOICES = [
    { id: 'name', label: 'Name' },
    { id: 'uuid', label: 'UUID' },
    { id: 'path', label: 'Path' },
    { id: 'cue_count', label: 'Cue Count' },
    { id: 'child_count', label: 'Child Count' },
    { id: 'is_video_input', label: 'Is Video Input' },
    { id: 'is_active', label: 'Is Active' },
];
const CUE_FIELD_CHOICES = [
    { id: 'name', label: 'Name' },
    { id: 'uuid', label: 'UUID' },
    { id: 'playlist_name', label: 'Playlist Name' },
    { id: 'playlist_uuid', label: 'Playlist UUID' },
    { id: 'is_playing', label: 'Is Playing' },
    { id: 'active_layer_name', label: 'Active Layer Name' },
    { id: 'active_layer_uuid', label: 'Active Layer UUID' },
];
const LAYER_FIELD_CHOICES = [
    { id: 'name', label: 'Name' },
    { id: 'uuid', label: 'UUID' },
    { id: 'is_active', label: 'Is Active' },
    { id: 'is_hidden', label: 'Is Hidden' },
    { id: 'is_muted', label: 'Is Muted' },
    { id: 'opacity', label: 'Opacity' },
    { id: 'target_set_name', label: 'Target Set Name' },
    { id: 'target_set_uuid', label: 'Target Set UUID' },
    { id: 'effect_preset_name', label: 'Effect Preset Name' },
    { id: 'effect_preset_uuid', label: 'Effect Preset UUID' },
    { id: 'layer_preset_name', label: 'Layer Preset Name' },
    { id: 'layer_preset_id', label: 'Layer Preset ID' },
    { id: 'blend_mode_name', label: 'Blend Mode Name' },
    { id: 'blend_mode_id', label: 'Blend Mode ID' },
    { id: 'blend_type', label: 'Blend Type' },
    { id: 'blend_opacity', label: 'Blend Opacity' },
    { id: 'blend_is_inverted', label: 'Blend Is Inverted' },
    { id: 'transition_name', label: 'Transition Name' },
    { id: 'transition_uuid', label: 'Transition UUID' },
    { id: 'transition_enabled', label: 'Transition Enabled' },
    { id: 'transition_duration', label: 'Transition Duration' },
    { id: 'transition_variable_count', label: 'Transition Variable Count' },
    { id: 'effects', label: 'Effects' },
    { id: 'effect_count', label: 'Effect Count' },
];
const TRANSPORT_FIELD_CHOICES = [
    { id: 'layer_name', label: 'Layer Name' },
    { id: 'layer_uuid', label: 'Layer UUID' },
    { id: 'playing_item_name', label: 'Playing Item Name' },
    { id: 'playing_item_uuid', label: 'Playing Item UUID' },
    { id: 'playing_media_name', label: 'Playing Media Name' },
    { id: 'playing_media_uuid', label: 'Playing Media UUID' },
    { id: 'is_playing', label: 'Is Playing' },
    { id: 'is_scrubbing', label: 'Is Scrubbing' },
    { id: 'playback_rate', label: 'Playback Rate' },
    { id: 'time_elapsed', label: 'Time Elapsed' },
    { id: 'time_remaining', label: 'Time Remaining' },
];
const WORKSPACE_FIELD_CHOICES = [
    { id: 'connection_status', label: 'Connection Status' },
    { id: 'last_poll_time', label: 'Last Poll Time' },
    { id: 'last_poll_error', label: 'Last Poll Error' },
    { id: 'playlist_count', label: 'Playlist Count' },
    { id: 'cue_count_total', label: 'Total Cue Count' },
    { id: 'layer_count', label: 'Layer Count' },
    { id: 'active_layer_count', label: 'Active Layer Count' },
    { id: 'active_cue_count', label: 'Active Cue Count' },
    { id: 'workspace_is_clear', label: 'Workspace Is Clear' },
    { id: 'workspace_has_active_media', label: 'Workspace Has Active Media' },
    { id: 'workspace_time_remaining_lowest', label: 'Lowest Time Remaining' },
    { id: 'workspace_current_media_names', label: 'Current Media Names' },
    { id: 'workspace_current_cue_names', label: 'Current Cue Names' },
    { id: 'workspace_effects', label: 'Workspace Effects' },
    { id: 'workspace_effect_count', label: 'Workspace Effect Count' },
    { id: 'workspace_effect_preset_name', label: 'Workspace Effect Preset Name' },
    { id: 'workspace_effect_preset_uuid', label: 'Workspace Effect Preset UUID' },
    { id: 'workspace_effect_preset_effect_count', label: 'Workspace Effect Preset Effect Count' },
    { id: 'workspace_transition_name', label: 'Workspace Transition Name' },
    { id: 'workspace_transition_uuid', label: 'Workspace Transition UUID' },
    { id: 'workspace_transition_enabled', label: 'Workspace Transition Enabled' },
    { id: 'workspace_transition_duration', label: 'Workspace Transition Duration' },
    { id: 'workspace_transition_variable_count', label: 'Workspace Transition Variable Count' },
];
const EFFECT_FIELD_CHOICES = [
    { id: 'name', label: 'Name' },
    { id: 'uuid', label: 'UUID' },
    { id: 'enabled', label: 'Enabled' },
    { id: 'variable_count', label: 'Variable Count' },
    { id: 'variable_name', label: 'Variable Name' },
    { id: 'variable_type', label: 'Variable Type' },
    { id: 'variable_value', label: 'Variable Value' },
    { id: 'variable_min', label: 'Variable Min' },
    { id: 'variable_max', label: 'Variable Max' },
    { id: 'variable_color', label: 'Variable Color' },
    { id: 'variable_default', label: 'Variable Default' },
];
const CATALOG_FIELD_CHOICES = [
    { id: 'name', label: 'Name' },
    { id: 'uuid', label: 'UUID' },
    { id: 'id', label: 'ID' },
    { id: 'enabled', label: 'Enabled' },
    { id: 'effect_count', label: 'Effect Count' },
    { id: 'variable_count', label: 'Variable Count' },
];
function getFeedbackDefinitions(getState) {
    return {
        [exports.FEEDBACK_ID_PLAYLIST_CONDITION]: {
            type: 'boolean',
            name: 'Playlist condition',
            description: 'Checks one playlist property selected from the dropdown',
            defaultStyle: {
                bgcolor: 0x0044aa,
                color: 0xffffff,
            },
            options: [
                playlistIndexOption(),
                dropdownOption('field', 'Field', PLAYLIST_FIELD_CHOICES, 'is_active'),
                compareOption('truthy'),
                textOption('expected', 'Expected Value'),
            ],
            callback: (feedback) => {
                const state = getState();
                const playlist = state.playlists[Number(feedback.options.playlistIndex)];
                const actual = getPlaylistField(state, playlist, String(feedback.options.field ?? ''));
                return compareValues(actual, String(feedback.options.comparison), feedback.options.expected);
            },
        },
        [exports.FEEDBACK_ID_CUE_CONDITION]: {
            type: 'boolean',
            name: 'Cue condition',
            description: 'Checks one cue property selected from the dropdown',
            defaultStyle: {
                bgcolor: 0x00aa00,
                color: 0xffffff,
            },
            options: [
                playlistIndexOption(),
                {
                    type: 'number',
                    id: 'cueIndex',
                    label: 'Cue Index',
                    min: 0,
                    max: 999,
                    default: 0,
                },
                dropdownOption('field', 'Field', CUE_FIELD_CHOICES, 'is_playing'),
                compareOption('truthy'),
                textOption('expected', 'Expected Value'),
            ],
            callback: (feedback) => {
                const state = getState();
                const playlist = state.playlists[Number(feedback.options.playlistIndex)];
                const cue = playlist?.items[Number(feedback.options.cueIndex)];
                const actual = getCueField(state, playlist, cue, String(feedback.options.field ?? ''));
                return compareValues(actual, String(feedback.options.comparison), feedback.options.expected);
            },
        },
        [exports.FEEDBACK_ID_LAYER_CONDITION]: {
            type: 'boolean',
            name: 'Layer condition',
            description: 'Checks one layer property selected from the dropdown',
            defaultStyle: {
                bgcolor: 0xaa5500,
                color: 0xffffff,
            },
            options: [
                layerIndexOption(),
                dropdownOption('field', 'Field', LAYER_FIELD_CHOICES, 'is_active'),
                compareOption('truthy'),
                textOption('expected', 'Expected Value'),
            ],
            callback: (feedback) => {
                const state = getState();
                const layerIndex = Number(feedback.options.layerIndex);
                const layer = getLayer(state, layerIndex);
                const actual = getLayerField(state, layer, layerIndex, String(feedback.options.field ?? ''));
                return compareValues(actual, String(feedback.options.comparison), feedback.options.expected);
            },
        },
        [exports.FEEDBACK_ID_TRANSPORT_CONDITION]: {
            type: 'boolean',
            name: 'Transport condition',
            description: 'Checks one transport property selected from the dropdown',
            defaultStyle: {
                bgcolor: 0x008855,
                color: 0xffffff,
            },
            options: [
                layerIndexOption(),
                dropdownOption('field', 'Field', TRANSPORT_FIELD_CHOICES, 'is_playing'),
                compareOption('truthy'),
                textOption('expected', 'Expected Value'),
            ],
            callback: (feedback) => {
                const state = getState();
                const transport = getTransport(state, Number(feedback.options.layerIndex));
                const actual = getTransportField(transport, String(feedback.options.field ?? ''));
                return compareValues(actual, String(feedback.options.comparison), feedback.options.expected);
            },
        },
        [exports.FEEDBACK_ID_WORKSPACE_CONDITION]: {
            type: 'boolean',
            name: 'Workspace condition',
            description: 'Checks one workspace property selected from the dropdown',
            defaultStyle: {
                bgcolor: 0x336699,
                color: 0xffffff,
            },
            options: [
                dropdownOption('field', 'Field', WORKSPACE_FIELD_CHOICES, 'workspace_has_active_media'),
                compareOption('truthy'),
                textOption('expected', 'Expected Value'),
            ],
            callback: (feedback) => {
                const state = getState();
                const actual = getWorkspaceField(state, String(feedback.options.field ?? ''));
                return compareValues(actual, String(feedback.options.comparison), feedback.options.expected);
            },
        },
        [exports.FEEDBACK_ID_EFFECT_CONDITION]: {
            type: 'boolean',
            name: 'Effect condition',
            description: 'Checks one layer or workspace effect property selected from the dropdown',
            defaultStyle: {
                bgcolor: 0x663399,
                color: 0xffffff,
            },
            options: [
                dropdownOption('scope', 'Scope', [
                    { id: 'layer', label: 'Layer Effect' },
                    { id: 'workspace', label: 'Workspace Effect' },
                ], 'layer'),
                layerIndexOption(),
                {
                    type: 'number',
                    id: 'effectIndex',
                    label: 'Effect Index',
                    min: 0,
                    max: 999,
                    default: 0,
                },
                {
                    type: 'number',
                    id: 'variableIndex',
                    label: 'Variable Index',
                    min: 0,
                    max: 999,
                    default: 0,
                },
                dropdownOption('field', 'Field', EFFECT_FIELD_CHOICES, 'enabled'),
                compareOption('truthy'),
                textOption('expected', 'Expected Value'),
            ],
            callback: (feedback) => {
                const state = getState();
                const effect = getEffect(state, String(feedback.options.scope ?? 'layer'), Number(feedback.options.layerIndex), Number(feedback.options.effectIndex));
                const actual = getEffectField(effect, Number(feedback.options.variableIndex), String(feedback.options.field ?? ''));
                return compareValues(actual, String(feedback.options.comparison), feedback.options.expected);
            },
        },
        [exports.FEEDBACK_ID_CATALOG_CONDITION]: {
            type: 'boolean',
            name: 'Catalog condition',
            description: 'Checks one target set, preset, blend mode, transition, or available effect property',
            defaultStyle: {
                bgcolor: 0x5555aa,
                color: 0xffffff,
            },
            options: [
                dropdownOption('catalog', 'Catalog', [
                    { id: 'target_set', label: 'Target Set' },
                    { id: 'blend_mode', label: 'Blend Mode' },
                    { id: 'layer_preset', label: 'Layer Preset' },
                    { id: 'effect_preset', label: 'Effect Preset' },
                    { id: 'transition', label: 'Transition' },
                    { id: 'available_effect', label: 'Available Effect' },
                ], 'target_set'),
                {
                    type: 'number',
                    id: 'catalogIndex',
                    label: 'Catalog Index',
                    min: 0,
                    max: 999,
                    default: 0,
                },
                dropdownOption('field', 'Field', CATALOG_FIELD_CHOICES, 'name'),
                compareOption('eq'),
                textOption('expected', 'Expected Value'),
            ],
            callback: (feedback) => {
                const actual = getCatalogField(getState(), String(feedback.options.catalog ?? ''), Number(feedback.options.catalogIndex), String(feedback.options.field ?? ''));
                return compareValues(actual, String(feedback.options.comparison), feedback.options.expected);
            },
        },
    };
}
function getLayer(state, layerIndex) {
    return state.layers[layerIndex] ?? state.workspaceTransport[layerIndex]?.layer;
}
function getTransport(state, layerIndex) {
    return state.workspaceTransport[layerIndex];
}
function getEffect(state, scope, layerIndex, effectIndex) {
    if (scope === 'workspace')
        return state.workspaceEffects[effectIndex];
    return getLayer(state, layerIndex)?.effects[effectIndex];
}
function getPlaylistField(state, playlist, field) {
    if (!playlist)
        return undefined;
    switch (field) {
        case 'name':
            return playlist.name;
        case 'uuid':
            return playlist.uuid;
        case 'path':
            return playlist.path;
        case 'cue_count':
            return playlist.items.length;
        case 'child_count':
            return playlist.childCount;
        case 'is_video_input':
            return playlist.isVideoInput;
        case 'is_active': {
            const cueUuids = new Set(playlist.items.map((cue) => cue.uuid).filter(Boolean));
            return state.workspaceTransport.some((transport) => {
                const activeCueUuid = transport.playingItem?.uuid;
                return Boolean(activeCueUuid && cueUuids.has(activeCueUuid));
            });
        }
        default:
            return undefined;
    }
}
function getCueField(state, playlist, cue, field) {
    if (!playlist || !cue)
        return undefined;
    const activeTransport = state.workspaceTransport.find((transport) => transport.playingItem?.uuid === cue.uuid);
    switch (field) {
        case 'name':
            return cue.name;
        case 'uuid':
            return cue.uuid;
        case 'playlist_name':
            return playlist.name;
        case 'playlist_uuid':
            return playlist.uuid;
        case 'is_playing':
            return Boolean(activeTransport);
        case 'active_layer_name':
            return activeTransport?.layer?.name;
        case 'active_layer_uuid':
            return activeTransport?.layer?.uuid;
        default:
            return undefined;
    }
}
function getLayerField(state, layer, layerIndex, field) {
    if (!layer)
        return undefined;
    switch (field) {
        case 'name':
            return layer.name;
        case 'uuid':
            return layer.uuid;
        case 'is_active':
            return Boolean(state.workspaceTransport[layerIndex]?.playingItem?.uuid);
        case 'is_hidden':
            return layer.isHidden;
        case 'is_muted':
            return layer.isMuted;
        case 'opacity':
            return layer.opacity;
        case 'target_set_name':
            return layer.targetSetName;
        case 'target_set_uuid':
            return layer.targetSetUUID;
        case 'effect_preset_name':
            return layer.effectPresetName;
        case 'effect_preset_uuid':
            return layer.effectPresetUUID;
        case 'layer_preset_name':
            return layer.layerPresetName;
        case 'layer_preset_id':
            return layer.layerPresetId;
        case 'blend_mode_name':
            return layer.blendMode?.name ?? layer.blend?.modeName;
        case 'blend_mode_id':
            return layer.blendMode?.id ?? layer.blend?.modeIndex;
        case 'blend_type':
            return layer.blend?.type;
        case 'blend_opacity':
            return layer.blend?.opacity;
        case 'blend_is_inverted':
            return layer.blend?.isInverted;
        case 'transition_name':
            return layer.transition?.name;
        case 'transition_uuid':
            return layer.transition?.uuid;
        case 'transition_enabled':
            return layer.transition?.enabled;
        case 'transition_duration':
            return layer.transitionDuration;
        case 'transition_variable_count':
            return layer.transition?.variables.length ?? 0;
        case 'effects':
            return layer.effects.map((effect) => effect.name).filter(Boolean).join(', ');
        case 'effect_count':
            return layer.effects.length;
        default:
            return undefined;
    }
}
function getTransportField(transport, field) {
    if (!transport)
        return undefined;
    switch (field) {
        case 'layer_name':
            return transport.layer?.name;
        case 'layer_uuid':
            return transport.layer?.uuid;
        case 'playing_item_name':
            return transport.playingItem?.name;
        case 'playing_item_uuid':
            return transport.playingItem?.uuid;
        case 'playing_media_name':
            return transport.playingMedia?.name;
        case 'playing_media_uuid':
            return transport.playingMedia?.uuid;
        case 'is_playing':
            return transport.isPlaying;
        case 'is_scrubbing':
            return transport.isScrubbing;
        case 'playback_rate':
            return transport.playbackRate;
        case 'time_elapsed':
            return transport.timeElapsed;
        case 'time_remaining':
            return transport.timeRemaining;
        default:
            return undefined;
    }
}
function getWorkspaceField(state, field) {
    const activeTransports = state.workspaceTransport.filter((transport) => Boolean(transport.playingItem?.uuid));
    const remainingTimes = state.workspaceTransport
        .map((transport) => transport.timeRemaining)
        .filter((value) => typeof value === 'number');
    switch (field) {
        case 'connection_status':
            return state.lastPollError ? 'error' : 'ok';
        case 'last_poll_time':
            return state.lastPollTime;
        case 'last_poll_error':
            return state.lastPollError;
        case 'playlist_count':
            return state.playlists.length;
        case 'cue_count_total':
            return state.playlists.reduce((total, playlist) => total + playlist.items.length, 0);
        case 'layer_count':
            return state.layers.length;
        case 'active_layer_count':
            return activeTransports.length;
        case 'active_cue_count':
            return new Set(state.workspaceTransport.map((transport) => transport.playingItem?.uuid).filter(Boolean)).size;
        case 'workspace_is_clear':
            return activeTransports.length === 0;
        case 'workspace_has_active_media':
            return state.workspaceTransport.some((transport) => Boolean(transport.playingMedia?.uuid));
        case 'workspace_time_remaining_lowest':
            return remainingTimes.length ? Math.min(...remainingTimes) : undefined;
        case 'workspace_current_media_names':
            return state.workspaceTransport.map((transport) => transport.playingMedia?.name).filter(Boolean).join(', ');
        case 'workspace_current_cue_names':
            return state.workspaceTransport.map((transport) => transport.playingItem?.name).filter(Boolean).join(', ');
        case 'workspace_effects':
            return state.workspaceEffects.map((effect) => effect.name).filter(Boolean).join(', ');
        case 'workspace_effect_count':
            return state.workspaceEffects.length;
        case 'workspace_effect_preset_name':
            return state.workspaceEffectPreset?.name;
        case 'workspace_effect_preset_uuid':
            return state.workspaceEffectPreset?.uuid;
        case 'workspace_effect_preset_effect_count':
            return state.workspaceEffectPreset?.effects.length ?? 0;
        case 'workspace_transition_name':
            return state.workspaceTransition?.name;
        case 'workspace_transition_uuid':
            return state.workspaceTransition?.uuid;
        case 'workspace_transition_enabled':
            return state.workspaceTransition?.enabled;
        case 'workspace_transition_duration':
            return state.workspaceTransitionDuration;
        case 'workspace_transition_variable_count':
            return state.workspaceTransition?.variables.length ?? 0;
        default:
            return undefined;
    }
}
function getEffectField(effect, variableIndex, field) {
    if (!effect)
        return undefined;
    const variable = effect.variables[variableIndex];
    switch (field) {
        case 'name':
            return effect.name;
        case 'uuid':
            return effect.uuid;
        case 'enabled':
            return effect.enabled;
        case 'variable_count':
            return effect.variables.length;
        case 'variable_name':
            return variable?.name;
        case 'variable_type':
            return variable?.type;
        case 'variable_value':
            return variable?.value;
        case 'variable_min':
            return variable?.min;
        case 'variable_max':
            return variable?.max;
        case 'variable_color':
            return variable?.color;
        case 'variable_default':
            return variable?.default;
        default:
            return undefined;
    }
}
function getCatalogField(state, catalog, index, field) {
    if (catalog === 'target_set') {
        const entry = state.targetSets[index];
        if (!entry)
            return undefined;
        if (field === 'name')
            return entry.name;
        if (field === 'uuid')
            return entry.uuid;
        return undefined;
    }
    if (catalog === 'blend_mode') {
        const entry = state.blendModes[index];
        if (!entry)
            return undefined;
        if (field === 'name')
            return entry.name;
        if (field === 'id')
            return entry.id;
        return undefined;
    }
    if (catalog === 'layer_preset') {
        const entry = state.layerPresets[index];
        if (!entry)
            return undefined;
        if (field === 'name')
            return entry.name;
        if (field === 'id')
            return entry.id;
        return undefined;
    }
    if (catalog === 'effect_preset') {
        const entry = state.effectPresets[index];
        if (!entry)
            return undefined;
        if (field === 'name')
            return entry.name;
        if (field === 'uuid')
            return entry.uuid;
        if (field === 'effect_count')
            return entry.effects.length;
        return undefined;
    }
    if (catalog === 'transition') {
        const entry = state.transitions[index];
        if (!entry)
            return undefined;
        if (field === 'name')
            return entry.name;
        if (field === 'uuid')
            return entry.uuid;
        if (field === 'enabled')
            return entry.enabled;
        if (field === 'variable_count')
            return entry.variables.length;
        return undefined;
    }
    if (catalog === 'available_effect') {
        const entry = state.availableEffects[index];
        if (!entry)
            return undefined;
        if (field === 'name')
            return entry.name;
        if (field === 'uuid')
            return entry.uuid;
        if (field === 'enabled')
            return entry.enabled;
        if (field === 'variable_count')
            return entry.variables.length;
    }
    return undefined;
}
function compareValues(actual, comparison, expected) {
    if (comparison === 'truthy')
        return isTruthyValue(actual);
    if (comparison === 'falsy')
        return !isTruthyValue(actual);
    if (actual === undefined || actual === null)
        return false;
    if (['gt', 'gte', 'lt', 'lte'].includes(comparison)) {
        return compareNumbers(Number(actual), comparison, Number(expected));
    }
    const actualString = String(actual);
    const expectedString = String(expected ?? '').trim();
    switch (comparison) {
        case 'eq':
            return actualString === expectedString;
        case 'ne':
            return actualString !== expectedString;
        case 'contains':
            return actualString.toLowerCase().includes(expectedString.toLowerCase());
        case 'not_contains':
            return !actualString.toLowerCase().includes(expectedString.toLowerCase());
        default:
            return false;
    }
}
function isTruthyValue(value) {
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'number')
        return value !== 0;
    if (typeof value !== 'string')
        return Boolean(value);
    const normalized = value.trim().toLowerCase();
    return ['true', 'yes', '1', 'on', 'enabled', 'ok', 'playing', 'active'].includes(normalized);
}
function compareNumbers(actual, comparison, expected) {
    if (actual === undefined || !Number.isFinite(actual) || !Number.isFinite(expected))
        return false;
    switch (comparison) {
        case 'eq':
            return Math.abs(actual - expected) < 0.001;
        case 'ne':
            return Math.abs(actual - expected) >= 0.001;
        case 'gt':
            return actual > expected;
        case 'gte':
            return actual >= expected;
        case 'lt':
            return actual < expected;
        case 'lte':
            return actual <= expected;
        default:
            return false;
    }
}
function layerIndexOption() {
    return {
        type: 'number',
        id: 'layerIndex',
        label: 'Layer Index',
        min: 0,
        max: 999,
        default: 0,
    };
}
function playlistIndexOption() {
    return {
        type: 'number',
        id: 'playlistIndex',
        label: 'Playlist Index',
        min: 0,
        max: 999,
        default: 0,
    };
}
function compareOption(defaultValue = 'eq') {
    return {
        type: 'dropdown',
        id: 'comparison',
        label: 'Comparison',
        default: defaultValue,
        choices: COMPARE_CHOICES,
    };
}
function dropdownOption(id, label, choices, defaultValue) {
    return {
        type: 'dropdown',
        id,
        label,
        default: defaultValue,
        choices,
    };
}
function valueOption(label, min, max, defaultValue) {
    return {
        type: 'number',
        id: 'value',
        label,
        min,
        max,
        default: defaultValue,
    };
}
function textOption(id, label) {
    return {
        type: 'textinput',
        id,
        label,
        default: '',
    };
}
function matchNameOrUuidOption(subject) {
    return {
        type: 'dropdown',
        id: 'matchMode',
        label: `Match ${subject} By`,
        default: 'name',
        choices: [
            { id: 'name', label: `${subject} Name` },
            { id: 'uuid', label: `${subject} UUID` },
        ],
    };
}
