# Renewed Vision PVP 3

*This module only supports PVP version 3.1 and above.*

Go to [Renewed Vision](https://renewedvision.com/provideoplayer/) to learn more about the software.

>  ProVideoPlayer (PVP) is a Mac-based software application designed to play back and manipulate video across one or more screens.

> For over a decade, productions and installations have used ProVideoPlayer for playback to one or more screens along with other tools as part of the full rig: ProPresenter for text and CG, a video rig for camera shots and live produced content, and an expensive screen control system to pull it all together. For many events, a lot of powerful and expensive equipment is radically under-utilized, so we set out to see if we could make a single product that would provide the tools needed for many productions when the complexity of more expensive solutions is unnecessary. That is the vision realized with PVP3.



## Configuration

**Prepare PVP**

First open Preferences in PVP, open the Network tab, and enable network API support.

Choose a port to listen on. Make sure `Use HTTPS Connection` and `Require Authentication` are unchecked, as this module doesn't support those options yet.



**Configure Companion**

Enter in the IP address and port PVP is running on.



## Important Notes

Whenever you see `Layer ID` or `Playlist ID` mentioned in an action, you can reference it in one of two ways:

- By its full name (as displayed in PVP). This is the easiest way.
- By its index. For example, the first layer has an index of `0`, the second has an index of `1`, etc.

Number IDs are always interpreted as indexes, even if a layer or playlist has a numeric name.

**Live Video:** A playlist ID of `-1` will select the `Live Video` playlist.



## Actions

### Clear/Hide/Mute Layer/Workspace

| Action           | Description                              |
| ---------------- | ---------------------------------------- |
| Clear Layer      | Clears the specified layer of all media. |
| Mute Layer       | Mutes the audio in specified layer.      |
| Unmute Layer     | Unmutes the audio in the layer.          |
| Hide Layer       | Hides the specified layer.               |
| Unhide Layer     | Unhides the layer.                       |
| Clear Workspace  | Clears all the layers in the workspace.  |
| Mute Workspace   | Mutes the audio.                         |
| Unmute Workspace | Unmutes the audio.                       |
| Hide Workspace   | Hides the workspace.                     |
| Unhide Workspace | Unhides the workspace.                   |



### Select Layer/Workspace

| Action          | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| Select Layer    | Selects the layer in PVP.  <br />Set `Target Layer`to `Yes` to make the layer the target of untargeted media. |
| Select Playlist | Selects the playlist.                                        |



### Trigger

| Action                           | Description                                        |
| -------------------------------- | -------------------------------------------------- |
| Trigger Cue                      | Triggers a cue by its ID in the selected playlist. |
| Trigger Playlist                 | Triggers the first cue in the playlist.            |
| Trigger Cue in Playlist          | Triggers the cue in the playlist.                  |
| Trigger Cue in Playlist on Layer | Triggers the cue media in the playlist on a layer. |



### Layers

| Action           | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| Layer Blend Mode | Sets the layer's blend mode. The default blend mode is `Normal`. |
| Layer Opacity    | Sets the layer's opacity by percentage; a whole number from `0` to `100`.  <br />You can also make relative opacity adjustments by prefixing the value with a `+` or `-`. |
| Layer Preset     | Applies a preset to the specified layer. Leave the `Preset Name` option empty to unlink the layer's preset. |
| Layer Target Set | Changes the layer's target set.  <br />A PVP bug prevents target sets from being addressed by index. It can only be addressed by its name. |



----

For additional actions, please raise a feature request on [GitHub](https://github.com/bitfocus/companion-module-pvp/).
