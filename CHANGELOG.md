# @samvera/ramp

## 2.0.0 (03/20/2023)
- Renamed component library (#158)
- Caption support (#155)
- Update demo site description
- Add queryparam support in demo, to work with IIIF cookbook recipes (#153)
- Fix failing tests and webpack config (#152)
- Demo site (#151)
- Fix minor bugs in structure nav and file download (#143)
- Bump dependencies (#142)
- File download component (#132)
- Fix player and time tooltip difference (#131)
- Show structure in player when using structure nav (#130)
- Fix webvtt parser (#129)
- Test progress bar (#128)
- Update README.MD (#126)
- Fixed demo content (#125)
- Fix error in console when switchin canvases (#119)
- Parse 'start' prop in manifests, render accordingly in all components (#107)

# @samvera/iiif-react-media-player

## 1.2.1 (12/23/2021)
- 1.2.1
- Build files for v1.2.1
- Fix dependencies
- Code cleanup (#112)
- Add txt/vtt mime-type to parser
- Change parser to use http response info to distinguish file types (#111)
- Fix CSS for word document view
- Use mammoth to parse .doc to html, remove GDrive viewer (#106)
- Fix WebVTT parser (#105)
- URL validation regex change
- Change feedback for invalid transcript files (#102)
- Add poster image for video player (#100)
- Remove time tooltip over playhead (#99)

## 1.2.0 (10/12/2021)
- 1.2.0
- Build files for v1.2.0
- Refine input checks before parsing (#98)
- Use annotations instead of rendering in parser (#97)
- Scope CSS (#96)
- Fixes from beta.0 (#95)
- Transcript parser ($94)
- Display text transcripts (#92)
- Fixed styling and docs built for demo page (#88)
- Fix to include each component stylesheet into shipped package
- Wire transcpt (#87)
- Transcript UI implementation (#86)
- Hotkeys enabled via videojs-hotkeys plugin (#85)

## 1.1.0 (05/21/2021)
- Build files for v1.1.0 release and updated package.json
- Minor fixes and dependency clean up (#81)
- Add css to show nested structure properly (#79)
- Change manifest parsing for caption files (#77)
- Change audio player UI (#74)
- Add quality selector (#68)
- Improve timerail highlight (#62)
- Add instructions to static demo page for using external manifest URLs (#61)
- Update readme to add video.js to consuming application
- General config and dependency fixes (#55)
- Add caption (#54)
- Fix markers for navigation across canvases (#53)
- Fix for failing navigation when same item is clicked twice (#52)
- Bug fixes when switching the player (#51)
- Update markers styling (#49)
- Fix playhead z-index and marker tooltip (#46)
- Player switch for different types of media (#47)
- Make audio player smaller, and player responsive (#45)
- Structure nav (#44)
- Example of how to add a custom control as a Class to the player (#41)
- Indicate active structured navigation (#40)
- Customized control bar for the player (#39)
- Removes the duplicate instantiations of player caused by startTime endTime useEffect() (#38)
- Highlight timefragment on player (#37)
- Support moving playhead on videojs (#35)
- VideoJS initial wire up (#34)
- Start/offset support for media (#32)
- Add Scss pattern (#31)
- Fix failing tests and CircleCI integration (#30)
- Update packaging for NPM (#26)
- Add support for manifest prop (#27)
- Remove Axios (#25)
- Fix structural navigation (#14)
