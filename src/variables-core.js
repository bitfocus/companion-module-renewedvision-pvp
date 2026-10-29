"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVariableDefinitions = buildVariableDefinitions;
exports.buildVariableValues = buildVariableValues;
exports.structureSignature = structureSignature;
function buildVariableDefinitions(state) {
    const defs = [];
    addUtilityDefinitions(defs);
    addWorkspaceDefinitions(defs, state);
    addCatalogDefinitions(defs, state);
    state.playlists.forEach((playlist, playlistIndex) => {
        addDefs(defs, [
            [`playlist_${playlistIndex}_name`, `Playlist ${playlistIndex} name`],
            [`playlist_${playlistIndex}_uuid`, `Playlist ${playlistIndex} UUID`],
            [`playlist_${playlistIndex}_path`, `Playlist ${playlistIndex} path`],
            [`playlist_${playlistIndex}_cue_count`, `Playlist ${playlistIndex} cue count`],
            [`playlist_${playlistIndex}_child_count`, `Playlist ${playlistIndex} child count`],
            [`playlist_${playlistIndex}_is_video_input`, `Playlist ${playlistIndex} is video input`],
        ]);
        playlist.items.forEach((_cue, cueIndex) => {
            addDefs(defs, [
                [`playlist_${playlistIndex}_cue_${cueIndex}_name`, `Playlist ${playlistIndex} cue ${cueIndex} name`],
                [`playlist_${playlistIndex}_cue_${cueIndex}_uuid`, `Playlist ${playlistIndex} cue ${cueIndex} UUID`],
                [
                    `playlist_${playlistIndex}_cue_${cueIndex}_playlist_name`,
                    `Playlist ${playlistIndex} cue ${cueIndex} playlist name`,
                ],
                [
                    `playlist_${playlistIndex}_cue_${cueIndex}_playlist_uuid`,
                    `Playlist ${playlistIndex} cue ${cueIndex} playlist UUID`,
                ],
                [
                    `playlist_${playlistIndex}_cue_${cueIndex}_is_playing`,
                    `Playlist ${playlistIndex} cue ${cueIndex} is playing`,
                ],
                [
                    `playlist_${playlistIndex}_cue_${cueIndex}_active_layer_name`,
                    `Playlist ${playlistIndex} cue ${cueIndex} active layer name`,
                ],
                [
                    `playlist_${playlistIndex}_cue_${cueIndex}_active_layer_uuid`,
                    `Playlist ${playlistIndex} cue ${cueIndex} active layer UUID`,
                ],
            ]);
        });
    });
    state.layers.forEach((layer, layerIndex) => {
        addLayerVariableDefinitions(defs, `layer_${layerIndex}`, `Layer ${layerIndex}`, layer);
    });
    state.workspaceTransport.forEach((transport, transportIndex) => {
        addTransportVariableDefinitions(defs, transportIndex, transport.layer);
    });
    return dedupeDefinitions(defs);
}
function buildVariableValues(state) {
    const values = {};
    values.connection_status = state.lastPollError ? 'error' : 'ok';
    values.last_poll_time = state.lastPollTime ?? '';
    values.last_poll_error = state.lastPollError ?? '';
    values.playlist_count = String(state.playlists.length);
    values.cue_count_total = String(state.playlists.reduce((total, playlist) => total + playlist.items.length, 0));
    values.layer_count = String(state.layers.length);
    values.active_layer_count = String(state.workspaceTransport.filter((transport) => Boolean(transport.playingItem?.uuid)).length);
    values.active_cue_count = String(new Set(state.workspaceTransport.map((transport) => transport.playingItem?.uuid).filter(Boolean)).size);
    values.workspace_is_clear = formatBoolean(!state.workspaceTransport.some((transport) => Boolean(transport.playingItem?.uuid)));
    values.workspace_has_active_media = formatBoolean(state.workspaceTransport.some((transport) => Boolean(transport.playingMedia?.uuid)));
    const remainingTimes = state.workspaceTransport
        .map((transport) => transport.timeRemaining)
        .filter((value) => typeof value === 'number');
    const lowestRemaining = remainingTimes.length ? Math.min(...remainingTimes) : undefined;
    values.workspace_time_remaining_lowest = formatNumber(lowestRemaining);
    values.workspace_time_remaining_lowest_clock = formatClock(lowestRemaining);
    values.workspace_current_media_names = state.workspaceTransport
        .map((transport) => transport.playingMedia?.name)
        .filter(Boolean)
        .join(', ');
    values.workspace_current_cue_names = state.workspaceTransport
        .map((transport) => transport.playingItem?.name)
        .filter(Boolean)
        .join(', ');
    addWorkspaceValues(values, state);
    addCatalogValues(values, state);
    state.playlists.forEach((playlist, playlistIndex) => {
        values[`playlist_${playlistIndex}_name`] = playlist.name;
        values[`playlist_${playlistIndex}_uuid`] = playlist.uuid;
        values[`playlist_${playlistIndex}_path`] = playlist.path;
        values[`playlist_${playlistIndex}_cue_count`] = String(playlist.items.length);
        values[`playlist_${playlistIndex}_child_count`] = String(playlist.childCount);
        values[`playlist_${playlistIndex}_is_video_input`] = formatBoolean(playlist.isVideoInput);
        playlist.items.forEach((cue, cueIndex) => {
            const activeTransport = state.workspaceTransport.find((transport) => transport.playingItem?.uuid === cue.uuid);
            values[`playlist_${playlistIndex}_cue_${cueIndex}_name`] = cue.name;
            values[`playlist_${playlistIndex}_cue_${cueIndex}_uuid`] = cue.uuid;
            values[`playlist_${playlistIndex}_cue_${cueIndex}_playlist_name`] = playlist.name;
            values[`playlist_${playlistIndex}_cue_${cueIndex}_playlist_uuid`] = playlist.uuid;
            values[`playlist_${playlistIndex}_cue_${cueIndex}_is_playing`] = formatBoolean(Boolean(activeTransport));
            values[`playlist_${playlistIndex}_cue_${cueIndex}_active_layer_name`] =
                activeTransport?.layer?.name ?? '';
            values[`playlist_${playlistIndex}_cue_${cueIndex}_active_layer_uuid`] =
                activeTransport?.layer?.uuid ?? '';
        });
    });
    state.layers.forEach((layer, layerIndex) => {
        addLayerValues(values, `layer_${layerIndex}`, layer);
    });
    state.workspaceTransport.forEach((transport, transportIndex) => {
        values[`transport_${transportIndex}_layer_name`] = transport.layer?.name ?? '';
        values[`transport_${transportIndex}_layer_uuid`] = transport.layer?.uuid ?? '';
        values[`transport_${transportIndex}_playing_item_name`] = transport.playingItem?.name ?? '';
        values[`transport_${transportIndex}_playing_item_uuid`] = transport.playingItem?.uuid ?? '';
        values[`transport_${transportIndex}_playing_media_name`] = transport.playingMedia?.name ?? '';
        values[`transport_${transportIndex}_playing_media_uuid`] = transport.playingMedia?.uuid ?? '';
        values[`transport_${transportIndex}_is_playing`] = formatBoolean(transport.isPlaying);
        values[`transport_${transportIndex}_is_scrubbing`] = formatBoolean(transport.isScrubbing);
        values[`transport_${transportIndex}_playback_rate`] = formatNumber(transport.playbackRate);
        values[`transport_${transportIndex}_time_elapsed`] = formatNumber(transport.timeElapsed);
        values[`transport_${transportIndex}_time_elapsed_clock`] = formatClock(transport.timeElapsed);
        values[`transport_${transportIndex}_time_remaining`] = formatNumber(transport.timeRemaining);
        values[`transport_${transportIndex}_time_remaining_clock`] = formatClock(transport.timeRemaining);
        if (transport.layer) {
            addLayerValues(values, `transport_${transportIndex}_layer`, transport.layer);
        }
    });
    return values;
}
function structureSignature(state) {
    return JSON.stringify({
        playlists: state.playlists.map((playlist) => ({
            uuid: playlist.uuid,
            name: playlist.name,
            path: playlist.path,
            itemCount: playlist.items.length,
            childCount: playlist.childCount,
        })),
        layers: state.layers.map((layer) => ({
            uuid: layer.uuid,
            name: layer.name,
            effectCount: layer.effects.length,
            transitionVariableCount: layer.transition?.variables.length ?? 0,
            effectVariableCounts: layer.effects.map((effect) => effect.variables.length),
        })),
        workspaceEffectCount: state.workspaceEffects.length,
        workspaceTransitionVariableCount: state.workspaceTransition?.variables.length ?? 0,
        transportCount: state.workspaceTransport.length,
        catalogs: {
            targetSets: state.targetSets.length,
            blendModes: state.blendModes.length,
            layerPresets: state.layerPresets.length,
            effectPresets: state.effectPresets.length,
            transitions: state.transitions.length,
            availableEffects: state.availableEffects.length,
        },
    });
}
function addUtilityDefinitions(defs) {
    addDefs(defs, [
        ['connection_status', 'Connection status'],
        ['last_poll_time', 'Last poll time'],
        ['last_poll_error', 'Last poll error'],
        ['playlist_count', 'Playlist count'],
        ['cue_count_total', 'Total cue count'],
        ['layer_count', 'Layer count'],
        ['active_layer_count', 'Active layer count'],
        ['active_cue_count', 'Active cue count'],
        ['workspace_is_clear', 'Workspace is clear'],
        ['workspace_has_active_media', 'Workspace has active media'],
        ['workspace_time_remaining_lowest', 'Lowest workspace time remaining seconds'],
        ['workspace_time_remaining_lowest_clock', 'Lowest workspace time remaining clock'],
        ['workspace_current_media_names', 'Workspace current media names'],
        ['workspace_current_cue_names', 'Workspace current cue names'],
    ]);
}
function addWorkspaceDefinitions(defs, state) {
    addDefs(defs, [
        ['workspace_effects', 'Workspace effects'],
        ['workspace_effect_count', 'Workspace effect count'],
        ['workspace_effect_preset_name', 'Workspace effect preset name'],
        ['workspace_effect_preset_uuid', 'Workspace effect preset UUID'],
        ['workspace_effect_preset_effect_count', 'Workspace effect preset effect count'],
        ['workspace_transition_name', 'Workspace transition name'],
        ['workspace_transition_uuid', 'Workspace transition UUID'],
        ['workspace_transition_enabled', 'Workspace transition enabled'],
        ['workspace_transition_duration', 'Workspace transition duration'],
        ['workspace_transition_variable_count', 'Workspace transition variable count'],
    ]);
    state.workspaceEffects.forEach((effect, effectIndex) => {
        addEffectDefinitions(defs, `workspace_effect_${effectIndex}`, `Workspace effect ${effectIndex}`, effect);
    });
    state.workspaceTransition?.variables.forEach((_variable, variableIndex) => {
        addEffectVariableDefinitions(defs, `workspace_transition_variable_${variableIndex}`, `Workspace transition variable ${variableIndex}`);
    });
}
function addWorkspaceValues(values, state) {
    values.workspace_effects = state.workspaceEffects.map((effect) => effect.name).filter(Boolean).join(', ');
    values.workspace_effect_count = String(state.workspaceEffects.length);
    values.workspace_effect_preset_name = state.workspaceEffectPreset?.name ?? '';
    values.workspace_effect_preset_uuid = state.workspaceEffectPreset?.uuid ?? '';
    values.workspace_effect_preset_effect_count = String(state.workspaceEffectPreset?.effects.length ?? 0);
    values.workspace_transition_name = state.workspaceTransition?.name ?? '';
    values.workspace_transition_uuid = state.workspaceTransition?.uuid ?? '';
    values.workspace_transition_enabled = formatBoolean(state.workspaceTransition?.enabled);
    values.workspace_transition_duration = formatNumber(state.workspaceTransitionDuration);
    values.workspace_transition_variable_count = String(state.workspaceTransition?.variables.length ?? 0);
    state.workspaceEffects.forEach((effect, effectIndex) => {
        addEffectValues(values, `workspace_effect_${effectIndex}`, effect);
    });
    state.workspaceTransition?.variables.forEach((variable, variableIndex) => {
        addEffectVariableValues(values, `workspace_transition_variable_${variableIndex}`, variable);
    });
}
function addCatalogDefinitions(defs, state) {
    state.targetSets.forEach((_targetSet, index) => {
        addDefs(defs, [
            [`target_set_${index}_name`, `Target set ${index} name`],
            [`target_set_${index}_uuid`, `Target set ${index} UUID`],
        ]);
    });
    state.blendModes.forEach((_blendMode, index) => {
        addDefs(defs, [
            [`blend_mode_${index}_name`, `Blend mode ${index} name`],
            [`blend_mode_${index}_id`, `Blend mode ${index} ID`],
        ]);
    });
    state.layerPresets.forEach((_preset, index) => {
        addDefs(defs, [
            [`layer_preset_${index}_name`, `Layer preset ${index} name`],
            [`layer_preset_${index}_id`, `Layer preset ${index} ID`],
        ]);
    });
    state.effectPresets.forEach((_preset, index) => {
        addDefs(defs, [
            [`effect_preset_${index}_name`, `Effect preset ${index} name`],
            [`effect_preset_${index}_uuid`, `Effect preset ${index} UUID`],
            [`effect_preset_${index}_effect_count`, `Effect preset ${index} effect count`],
        ]);
    });
    state.transitions.forEach((_transition, index) => {
        addDefs(defs, [
            [`transition_${index}_name`, `Transition ${index} name`],
            [`transition_${index}_uuid`, `Transition ${index} UUID`],
            [`transition_${index}_enabled`, `Transition ${index} enabled`],
            [`transition_${index}_variable_count`, `Transition ${index} variable count`],
        ]);
    });
    state.availableEffects.forEach((effect, index) => {
        addEffectDefinitions(defs, `available_effect_${index}`, `Available effect ${index}`, effect, true);
    });
}
function addCatalogValues(values, state) {
    state.targetSets.forEach((targetSet, index) => {
        values[`target_set_${index}_name`] = targetSet.name ?? '';
        values[`target_set_${index}_uuid`] = targetSet.uuid ?? '';
    });
    state.blendModes.forEach((blendMode, index) => {
        values[`blend_mode_${index}_name`] = blendMode.name ?? '';
        values[`blend_mode_${index}_id`] = formatScalar(blendMode.id);
    });
    state.layerPresets.forEach((preset, index) => {
        values[`layer_preset_${index}_name`] = preset.name ?? '';
        values[`layer_preset_${index}_id`] = formatScalar(preset.id);
    });
    state.effectPresets.forEach((preset, index) => {
        values[`effect_preset_${index}_name`] = preset.name ?? '';
        values[`effect_preset_${index}_uuid`] = preset.uuid ?? '';
        values[`effect_preset_${index}_effect_count`] = String(preset.effects.length);
    });
    state.transitions.forEach((transition, index) => {
        values[`transition_${index}_name`] = transition.name ?? '';
        values[`transition_${index}_uuid`] = transition.uuid ?? '';
        values[`transition_${index}_enabled`] = formatBoolean(transition.enabled);
        values[`transition_${index}_variable_count`] = String(transition.variables.length);
    });
    state.availableEffects.forEach((effect, index) => {
        addEffectValues(values, `available_effect_${index}`, effect, true);
    });
}
function addLayerVariableDefinitions(defs, prefix, label, layer) {
    addDefs(defs, [
        [`${prefix}_name`, `${label} name`],
        [`${prefix}_uuid`, `${label} UUID`],
        [`${prefix}_is_hidden`, `${label} is hidden`],
        [`${prefix}_is_muted`, `${label} is muted`],
        [`${prefix}_opacity`, `${label} opacity`],
        [`${prefix}_target_set_name`, `${label} target set name`],
        [`${prefix}_target_set_uuid`, `${label} target set UUID`],
        [`${prefix}_effect_preset_name`, `${label} effect preset name`],
        [`${prefix}_effect_preset_uuid`, `${label} effect preset UUID`],
        [`${prefix}_layer_preset_name`, `${label} layer preset name`],
        [`${prefix}_layer_preset_id`, `${label} layer preset ID`],
        [`${prefix}_blend_mode_name`, `${label} blend mode name`],
        [`${prefix}_blend_mode_id`, `${label} blend mode ID`],
        [`${prefix}_blend_type`, `${label} blend type`],
        [`${prefix}_blend_opacity`, `${label} blend opacity`],
        [`${prefix}_blend_is_inverted`, `${label} blend is inverted`],
        [`${prefix}_transition_name`, `${label} transition name`],
        [`${prefix}_transition_uuid`, `${label} transition UUID`],
        [`${prefix}_transition_enabled`, `${label} transition enabled`],
        [`${prefix}_transition_duration`, `${label} transition duration`],
        [`${prefix}_transition_variable_count`, `${label} transition variable count`],
        [`${prefix}_effects`, `${label} effects`],
        [`${prefix}_effect_count`, `${label} effect count`],
    ]);
    addLayerEffectVariableDefinitions(defs, prefix, label, layer.effects);
    layer.transition?.variables.forEach((_variable, variableIndex) => {
        addEffectVariableDefinitions(defs, `${prefix}_transition_variable_${variableIndex}`, `${label} transition variable ${variableIndex}`);
    });
}
function addLayerValues(values, prefix, layer) {
    values[`${prefix}_name`] = layer.name ?? '';
    values[`${prefix}_uuid`] = layer.uuid ?? '';
    values[`${prefix}_is_hidden`] = formatBoolean(layer.isHidden);
    values[`${prefix}_is_muted`] = formatBoolean(layer.isMuted);
    values[`${prefix}_opacity`] = formatNumber(layer.opacity);
    values[`${prefix}_target_set_name`] = layer.targetSetName ?? '';
    values[`${prefix}_target_set_uuid`] = layer.targetSetUUID ?? '';
    values[`${prefix}_effect_preset_name`] = layer.effectPresetName ?? '';
    values[`${prefix}_effect_preset_uuid`] = layer.effectPresetUUID ?? '';
    values[`${prefix}_layer_preset_name`] = layer.layerPresetName ?? '';
    values[`${prefix}_layer_preset_id`] = formatScalar(layer.layerPresetId);
    values[`${prefix}_blend_mode_name`] = layer.blendMode?.name ?? layer.blend?.modeName ?? '';
    values[`${prefix}_blend_mode_id`] = formatScalar(layer.blendMode?.id ?? layer.blend?.modeIndex);
    values[`${prefix}_blend_type`] = layer.blend?.type ?? '';
    values[`${prefix}_blend_opacity`] = formatNumber(layer.blend?.opacity);
    values[`${prefix}_blend_is_inverted`] = formatBoolean(layer.blend?.isInverted);
    values[`${prefix}_transition_name`] = layer.transition?.name ?? '';
    values[`${prefix}_transition_uuid`] = layer.transition?.uuid ?? '';
    values[`${prefix}_transition_enabled`] = formatBoolean(layer.transition?.enabled);
    values[`${prefix}_transition_duration`] = formatNumber(layer.transitionDuration);
    values[`${prefix}_transition_variable_count`] = String(layer.transition?.variables.length ?? 0);
    values[`${prefix}_effects`] = layer.effects.map((effect) => effect.name).filter(Boolean).join(', ');
    values[`${prefix}_effect_count`] = String(layer.effects.length);
    layer.effects.forEach((effect, effectIndex) => {
        addEffectValues(values, `${prefix}_effect_${effectIndex}`, effect);
    });
    layer.transition?.variables.forEach((variable, variableIndex) => {
        addEffectVariableValues(values, `${prefix}_transition_variable_${variableIndex}`, variable);
    });
}
function addLayerEffectVariableDefinitions(defs, prefix, label, effects) {
    effects.forEach((effect, effectIndex) => {
        addEffectDefinitions(defs, `${prefix}_effect_${effectIndex}`, `${label} effect ${effectIndex}`, effect);
    });
}
function addEffectDefinitions(defs, prefix, label, effect, availableEffect = false) {
    addDefs(defs, [
        [`${prefix}_name`, `${label} name`],
        [`${prefix}_uuid`, `${label} UUID`],
        [`${prefix}_enabled`, `${label} enabled`],
        [`${prefix}_variable_count`, `${label} variable count`],
    ]);
    effect.variables.forEach((_variable, variableIndex) => {
        addEffectVariableDefinitions(defs, `${prefix}_variable_${variableIndex}`, `${label} variable ${variableIndex}`, availableEffect);
    });
}
function addEffectValues(values, prefix, effect, availableEffect = false) {
    values[`${prefix}_name`] = effect.name ?? '';
    values[`${prefix}_uuid`] = effect.uuid ?? '';
    values[`${prefix}_enabled`] = formatBoolean(effect.enabled);
    values[`${prefix}_variable_count`] = String(effect.variables.length);
    effect.variables.forEach((variable, variableIndex) => {
        addEffectVariableValues(values, `${prefix}_variable_${variableIndex}`, variable, availableEffect);
    });
}
function addEffectVariableDefinitions(defs, prefix, label, availableEffect = false) {
    addDefs(defs, [
        [`${prefix}_name`, `${label} name`],
        [`${prefix}_type`, `${label} type`],
        [availableEffect ? `${prefix}_default` : `${prefix}_value`, `${label} value`],
        [`${prefix}_min`, `${label} min`],
        [`${prefix}_max`, `${label} max`],
        [`${prefix}_color`, `${label} color`],
    ]);
}
function addEffectVariableValues(values, prefix, variable, availableEffect = false) {
    values[`${prefix}_name`] = variable.name ?? '';
    values[`${prefix}_type`] = variable.type ?? '';
    values[availableEffect ? `${prefix}_default` : `${prefix}_value`] = formatScalar(variable.default ?? variable.value);
    values[`${prefix}_min`] = formatNumber(variable.min);
    values[`${prefix}_max`] = formatNumber(variable.max);
    values[`${prefix}_color`] = variable.color ?? '';
}
function addTransportVariableDefinitions(defs, transportIndex, layer) {
    addDefs(defs, [
        [`transport_${transportIndex}_playing_item_name`, `Transport ${transportIndex} playing item name`],
        [`transport_${transportIndex}_playing_item_uuid`, `Transport ${transportIndex} playing item UUID`],
        [`transport_${transportIndex}_playing_media_name`, `Transport ${transportIndex} playing media name`],
        [`transport_${transportIndex}_playing_media_uuid`, `Transport ${transportIndex} playing media UUID`],
        [`transport_${transportIndex}_is_playing`, `Transport ${transportIndex} is playing`],
        [`transport_${transportIndex}_is_scrubbing`, `Transport ${transportIndex} is scrubbing`],
        [`transport_${transportIndex}_playback_rate`, `Transport ${transportIndex} playback rate`],
        [`transport_${transportIndex}_time_elapsed`, `Transport ${transportIndex} time elapsed seconds`],
        [`transport_${transportIndex}_time_elapsed_clock`, `Transport ${transportIndex} time elapsed clock`],
        [`transport_${transportIndex}_time_remaining`, `Transport ${transportIndex} time remaining seconds`],
        [`transport_${transportIndex}_time_remaining_clock`, `Transport ${transportIndex} time remaining clock`],
    ]);
    addLayerVariableDefinitions(defs, `transport_${transportIndex}_layer`, `Transport ${transportIndex} layer`, layer ?? { effects: [] });
}
function addDefs(defs, entries) {
    entries.forEach(([variableId, name]) => defs.push({ variableId, name }));
}
function dedupeDefinitions(defs) {
    const seen = new Set();
    return defs.filter((definition) => {
        if (seen.has(definition.variableId))
            return false;
        seen.add(definition.variableId);
        return true;
    });
}
function formatBoolean(value) {
    return value === undefined ? '' : value ? 'true' : 'false';
}
function formatNumber(value) {
    return value === undefined ? '' : Number.isInteger(value) ? String(value) : value.toFixed(3);
}
function formatScalar(value) {
    if (typeof value === 'number')
        return formatNumber(value);
    if (typeof value === 'boolean')
        return formatBoolean(value);
    return value ?? '';
}
function formatClock(value) {
    if (value === undefined || !Number.isFinite(value))
        return '';
    const totalSeconds = Math.max(0, Math.ceil(value));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
