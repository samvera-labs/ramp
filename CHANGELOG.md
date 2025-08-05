# @samvera/ramp

## v4.0.2 tag (08/05/2025)
* Fix voiceover and a11y for cues in transcripts & annotations by @Dananji in https://github.com/samvera-labs/ramp/pull/859

## v4.0.1 tag (07/30/2025)
* Implement sectioning elements/landmark roles for page navigation by @Dananji in https://github.com/samvera-labs/ramp/pull/827
* Round time to milliseconds for accurate time calculations by @Dananji in https://github.com/samvera-labs/ramp/pull/835
* Fix a11y issues around structure and markers form by @Dananji in https://github.com/samvera-labs/ramp/pull/834
* Bump webpack-dev-server from 4.13.1 to 5.2.1 by @dependabot[bot] in https://github.com/samvera-labs/ramp/pull/832
* Remove timespan sorting in structured nav by @Dananji in https://github.com/samvera-labs/ramp/pull/842
* Scope and fix SVG CSS by @Dananji in https://github.com/samvera-labs/ramp/pull/843
* Change WebVTT validation to allow files with embedded metadata by @Dananji in https://github.com/samvera-labs/ramp/pull/844
* Browser determined download for files tab by @cjcolvar in https://github.com/samvera-labs/ramp/pull/849
* Bump form-data from 3.0.1 to 3.0.4 by @dependabot[bot] in https://github.com/samvera-labs/ramp/pull/851
* Remove untimed search hits and preserve inline styling for search within by @Dananji in https://github.com/samvera-labs/ramp/pull/852
* Fix shift+tab behavior in annotations and transcript components by @masaball in https://github.com/samvera-labs/ramp/pull/856

## v4.0.0 tag (06/11/2025)
* Use resize event on window.visualViewport to adjust control-bar width for mobile devices by @Dananji in https://github.com/samvera-labs/ramp/pull/736
* Fix annotation parsing for Aviary annotations by @Dananji in https://github.com/samvera-labs/ramp/pull/740
* Fix error message display and general parsing error for AVAnnotate manifests by @Dananji in https://github.com/samvera-labs/ramp/pull/742
* Avoid parsing structure ranges with 'behavior=thumbnail-nav' by @Dananji in https://github.com/samvera-labs/ramp/pull/743
* Turn on nativeTextTracks only for browsers using native iOS player by @Dananji in https://github.com/samvera-labs/ramp/pull/744
* Fix seeked time reset on player load in Safari by @Dananji in https://github.com/samvera-labs/ramp/pull/741
* Set font-size CSS in metadata display component and cleanup by @Dananji in https://github.com/samvera-labs/ramp/pull/747
* Enable error close button for multiple canvas manifests by @Dananji in https://github.com/samvera-labs/ramp/pull/749
* Bump nanoid from 3.3.6 to 3.3.8 by @dependabot in https://github.com/samvera-labs/ramp/pull/752
* Annotation parser by @Dananji in https://github.com/samvera-labs/ramp/pull/751
* Parse annotations from linked external AnnotationPage(s) by @Dananji in https://github.com/samvera-labs/ramp/pull/754
* Convert data from linked annotations to the same data format by @Dananji in https://github.com/samvera-labs/ramp/pull/756
* Display line breaks within a cue for WebVTT and SRT transcripts by @Dananji in https://github.com/samvera-labs/ramp/pull/755
* Annotations component by @Dananji in https://github.com/samvera-labs/ramp/pull/757
* Check player is not null before player.trigger('resize') event by @Dananji in https://github.com/samvera-labs/ramp/pull/760
* Display Aviary annotations and filter linked annotations by @Dananji in https://github.com/samvera-labs/ramp/pull/758
* Annotations functionalities by @Dananji in https://github.com/samvera-labs/ramp/pull/761
* Scroll active section into view when playback is started by @Dananji in https://github.com/samvera-labs/ramp/pull/770
* Config show more as a prop, use component's width to show/hide show more button by @Dananji in https://github.com/samvera-labs/ramp/pull/769
* Rename annotation layer -> annotation set by @Dananji in https://github.com/samvera-labs/ramp/pull/772
* Handle click on a link in annotation: open URL in same tab without seeking player by @Dananji in https://github.com/samvera-labs/ramp/pull/771
* Use showNotes prop in transcript search to filter by @Dananji in https://github.com/samvera-labs/ramp/pull/773
* A11y transcript cues by @Dananji in https://github.com/samvera-labs/ramp/pull/774
* Check for annotations before rendering AnnotationsDisplay by @Dananji in https://github.com/samvera-labs/ramp/pull/776
* Fix display of longer list of tags with show/hide more button by @Dananji in https://github.com/samvera-labs/ramp/pull/775
* Use aria-live for player updates, aria-label & aria-role='button' for links in structured nav by @Dananji in https://github.com/samvera-labs/ramp/pull/780
* Annotation cleanup by @Dananji in https://github.com/samvera-labs/ramp/pull/782
* Bump prismjs from 1.29.0 to 1.30.0 by @dependabot in https://github.com/samvera-labs/ramp/pull/783
* Bump @babel/runtime from 7.21.0 to 7.26.10 by @dependabot in https://github.com/samvera-labs/ramp/pull/785
* Show time rail highlight for current timespan when nested by @Dananji in https://github.com/samvera-labs/ramp/pull/784
* Use a lighter color for active cues and annotation rows to fix contrast by @Dananji in https://github.com/samvera-labs/ramp/pull/793
* Scroll to clicked annotation when there's multiple annotations in range by @Dananji in https://github.com/samvera-labs/ramp/pull/794
* Copy over latest CircleCI config from SME by @Dananji in https://github.com/samvera-labs/ramp/pull/799
* Add event listener for click outside event to close annotations dropdown by @Dananji in https://github.com/samvera-labs/ramp/pull/801
* Handle manifest w/o items error in ErrorBoundary by @Dananji in https://github.com/samvera-labs/ramp/pull/802
* Keyboard a11y structure by @Dananji in https://github.com/samvera-labs/ramp/pull/787
* Truncate only text nodes without counting HTML markup, cleanup useEffects by @Dananji in https://github.com/samvera-labs/ramp/pull/800
* Scroll annotation into view when show less is clicked by @Dananji in https://github.com/samvera-labs/ramp/pull/803
* Add back missing autoScroll import by @cjcolvar in https://github.com/samvera-labs/ramp/pull/804
* Auto scroll time-point annotations by comparing start time avoiding end times by @Dananji in https://github.com/samvera-labs/ramp/pull/806
* Enable enter/space key activation for toggle button by @Dananji in https://github.com/samvera-labs/ramp/pull/807
* Bump http-proxy-middleware from 2.0.7 to 2.0.9 by @dependabot in https://github.com/samvera-labs/ramp/pull/810
* Fix double focus in structure and tabbed UI elements by @Dananji in https://github.com/samvera-labs/ramp/pull/812
* Handle sequential time updates in seek using setTimeout by @Dananji in https://github.com/samvera-labs/ramp/pull/813
* Fix double focus in strucutred nav on initial Shift+Tab by @Dananji in https://github.com/samvera-labs/ramp/pull/816
* Change role relationship in transcript cues by @Dananji in https://github.com/samvera-labs/ramp/pull/820
* Keyboard a11y annotations by @Dananji in https://github.com/samvera-labs/ramp/pull/805
* Fix possible role relation a11y issues in transcript display by @Dananji in https://github.com/samvera-labs/ramp/pull/821
* Fix voiceover and role relationship errors for annotations by @Dananji in https://github.com/samvera-labs/ramp/pull/823
* Limit button role for timestamps, to avoid a11y issues with links in annotations by @Dananji in https://github.com/samvera-labs/ramp/pull/824
* Fix file download icon placement on Canvas change by @Dananji in https://github.com/samvera-labs/ramp/pull/825
* Rename of MarkersDisplay -> Annotations component by @Dananji in https://github.com/samvera-labs/ramp/pull/826
* Update/cleanup styleguidist docs for 4.0.0 release by @Dananji in https://github.com/samvera-labs/ramp/pull/828
* Reveal player after initial seek event, set currentTime in play promise by @Dananji in https://github.com/samvera-labs/ramp/pull/822
* Bug fix: keep original order of timespans for playlist by @Dananji in https://github.com/samvera-labs/ramp/pull/829


## v3.3.0 tag (12/02/2024)
* Align CC btn in control bar with green border by @Dananji in https://github.com/samvera-labs/ramp/pull/598
* Use targetTouches in touch event to calculate progress updates by @Dananji in https://github.com/samvera-labs/ramp/pull/600
* Align structure highlight marker with hovered progress bar by @Dananji in https://github.com/samvera-labs/ramp/pull/604
* Force the media to load for iOS and Safari on desktop by @Dananji in https://github.com/samvera-labs/ramp/pull/607
* Fix broken captions button reference in handleCaptionChange() by @Dananji in https://github.com/samvera-labs/ramp/pull/608
* Start from custom manifest start by @masaball in https://github.com/samvera-labs/ramp/pull/609
* Default to empty string if manifest label is not present by @masaball in https://github.com/samvera-labs/ramp/pull/621
* Sanitize manifest url if params included in middle by @masaball in https://github.com/samvera-labs/ramp/pull/623
* Store captions on/off status in localstorage for session by @Dananji in https://github.com/samvera-labs/ramp/pull/613
* Display Video.js errors instead letting the player crash by @Dananji in https://github.com/samvera-labs/ramp/pull/612
* 3.2.1 patch by @Dananji in https://github.com/samvera-labs/ramp/pull/617
* Reveal player early on progress event with enough data for playback by @Dananji in https://github.com/samvera-labs/ramp/pull/626
* Limit time tooltip display offset to playable range width by @Dananji in https://github.com/samvera-labs/ramp/pull/629
* Fix player replaying last section/single section item in a loop by @Dananji in https://github.com/samvera-labs/ramp/pull/628
* Parsing refactor by @Dananji in https://github.com/samvera-labs/ramp/pull/625
* Zoom icons 596 by @Dananji in https://github.com/samvera-labs/ramp/pull/619
* React 18 upgrade by @Dananji in https://github.com/samvera-labs/ramp/pull/633
* Bump webpack from 5.76.2 to 5.94.0 by @dependabot in https://github.com/samvera-labs/ramp/pull/631
* Bump webpack-dev-middleware from 5.3.3 to 5.3.4 by @dependabot in https://github.com/samvera-labs/ramp/pull/634
* Limit re-renders for AutoAdvanceToggle, SupplementalFiles, and MarkersDisplay components by @Dananji in https://github.com/samvera-labs/ramp/pull/640
* Convert vjs components by @Dananji in https://github.com/samvera-labs/ramp/pull/635
* Make `withCredentials` work with videojs 7.x and 8.x by @mbklein in https://github.com/samvera-labs/ramp/pull/642
* Remove node-18 and add node-22 to CircleCI by @Dananji in https://github.com/samvera-labs/ramp/pull/641
* Remove useMemo in component export, refactor MetadataDisplay component by @Dananji in https://github.com/samvera-labs/ramp/pull/646
* State management refactor for structure by @Dananji in https://github.com/samvera-labs/ramp/pull/643
* Custom hook for state management in Transcript component by @Dananji in https://github.com/samvera-labs/ramp/pull/652
* Custom hook for MediaPlayer and VideoJSPlayer handling by @Dananji in https://github.com/samvera-labs/ramp/pull/647
* Bump rollup from 2.79.1 to 2.79.2 by @dependabot in https://github.com/samvera-labs/ramp/pull/651
* Bump tough-cookie from 4.1.2 to 4.1.4 by @dependabot in https://github.com/samvera-labs/ramp/pull/654
* Add comments, cleanup Videojs component options, use cx lib to build classnames by @Dananji in https://github.com/samvera-labs/ramp/pull/653
* Fix skipped tests for useLocalStorage by @Dananji in https://github.com/samvera-labs/ramp/pull/655
* Update player in Ramp demo site when using 'Set Manifest' by @Dananji in https://github.com/samvera-labs/ramp/pull/661
* Fix minor bugs in player introduced in refactor/cleanup work by @Dananji in https://github.com/samvera-labs/ramp/pull/662
* Move captions above controls when user is active by @Dananji in https://github.com/samvera-labs/ramp/pull/665
* Refine progress-bar by using VideoJS' native ProgressControl by @Dananji in https://github.com/samvera-labs/ramp/pull/664
* Remove cyclical dependence of SectionHeading and List by @Dananji in https://github.com/samvera-labs/ramp/pull/668
* Replace volume control with muteToggle/volumePanel, popup menus above progress-bar by @Dananji in https://github.com/samvera-labs/ramp/pull/669
* Adjust progress-bar spacing to display menus above it by @Dananji in https://github.com/samvera-labs/ramp/pull/670
* Collapse/expand sections button by @Dananji in https://github.com/samvera-labs/ramp/pull/671
* Bump http-proxy-middleware from 2.0.6 to 2.0.7 by @dependabot in https://github.com/samvera-labs/ramp/pull/683
* Change min-width and min-height of the player for iOS by @Dananji in https://github.com/samvera-labs/ramp/pull/684
* Regression bug: display error for empty Manifest w/o crashing by @Dananji in https://github.com/samvera-labs/ramp/pull/685
* Change UI for structured nav to include collapse all button by @Dananji in https://github.com/samvera-labs/ramp/pull/686
* Create inaccessible message interval only in a single custom hook by @Dananji in https://github.com/samvera-labs/ramp/pull/690
* Fix a11y issues found with Siteimprove, WAVE, and Axe by @Dananji in https://github.com/samvera-labs/ramp/pull/691
* Fix sections UI for non-collapsible structures by @Dananji in https://github.com/samvera-labs/ramp/pull/692
* Wrap long labels w/o spaces in structure to new lines by @Dananji in https://github.com/samvera-labs/ramp/pull/693
* Extend player min-width to Android browsers by @Dananji in https://github.com/samvera-labs/ramp/pull/696
* Center align progressbar in audio, and add padding by @Dananji in https://github.com/samvera-labs/ramp/pull/697
* Increase progress-bar height, remove hover animation by @Dananji in https://github.com/samvera-labs/ramp/pull/699
* Show timetool-tip above search marker when hovering by @Dananji in https://github.com/samvera-labs/ramp/pull/702
* Specify player's min-height for audio in mobile browsers by @Dananji in https://github.com/samvera-labs/ramp/pull/703
* Force player to load in Safari and iOS browsers by @Dananji in https://github.com/samvera-labs/ramp/pull/707
* Update progress-bar CSS on fullscreen exit in iOS by @Dananji in https://github.com/samvera-labs/ramp/pull/708
* Call player.load() in Safari/iOS browsers before calling play() by @Dananji in https://github.com/samvera-labs/ramp/pull/709
* Use control-bar width to add padding to progress-bar on sides by @Dananji in https://github.com/samvera-labs/ramp/pull/715
* Restrict setting player time when markers are outside of playable range by @Dananji in https://github.com/samvera-labs/ramp/pull/716
* Remove progress-bar shadow on focus by @Dananji in https://github.com/samvera-labs/ramp/pull/721
* Prevent playhead from jumping to end of progress bar by @masaball in https://github.com/samvera-labs/ramp/pull/725
* Trigger ended event when end = duration by @Dananji in https://github.com/samvera-labs/ramp/pull/722
* Add back tracks upon quality selection by @Dananji in https://github.com/samvera-labs/ramp/pull/720
* Change order of player.load() and setting isReady to keep markers by @Dananji in https://github.com/samvera-labs/ramp/pull/726
* Fix collapse/expand all button behavior with each section status change by @Dananji in https://github.com/samvera-labs/ramp/pull/729
* Invoke handleTimeupdate to update markers on player reload by @Dananji in https://github.com/samvera-labs/ramp/pull/735
* Explicitly update played range  by @Dananji in https://github.com/samvera-labs/ramp/pull/733
* Remove space between control-bar pseudo elements, to mouse display on hover by @Dananji in https://github.com/samvera-labs/ramp/pull/737
* Update README for 3.3.0 release by @Dananji in https://github.com/samvera-labs/ramp/pull/745

## v3.2.1 tag (08/09/2024)
* Set accurate duration on progress bar creation by @Dananji in https://github.com/samvera-labs/ramp/pull/616

## v3.2.0 tag (07/30/2024)
* Auto scroll active transcript cue to the top by @Dananji in https://github.com/samvera-labs/ramp/pull/449
* Bump express from 4.18.2 to 4.19.2 by @dependabot in https://github.com/samvera-labs/ramp/pull/465
* Display a message for empty manifests without crashing by @Dananji in https://github.com/samvera-labs/ramp/pull/475
* Adjust marker display on UI when end > canvas duration by @Dananji in https://github.com/samvera-labs/ramp/pull/471
* Build active structure item classname into a single line by @Dananji in https://github.com/samvera-labs/ramp/pull/478
* Bump tar from 6.1.13 to 6.2.1 by @dependabot in https://github.com/samvera-labs/ramp/pull/479
* Only display rendering files in the supplemental files component by @Dananji in https://github.com/samvera-labs/ramp/pull/474
* Upgrade Video.js to v8.10.0 by @masaball in https://github.com/samvera-labs/ramp/pull/453
* Skip combination keypresses in player hotkeys by @Dananji in https://github.com/samvera-labs/ramp/pull/481
* Rights metadata by @Dananji in https://github.com/samvera-labs/ramp/pull/480
* Videojs setup rework by @Dananji in https://github.com/samvera-labs/ramp/pull/460
* Vtt parse fix by @Dananji in https://github.com/samvera-labs/ramp/pull/476
* Add playback rate support for media player by @Dananji in https://github.com/samvera-labs/ramp/pull/477
* Bump gh-pages from 4.0.0 to 5.0.0 by @dependabot in https://github.com/samvera-labs/ramp/pull/482
* Fix track scrubber bugs in Videojs re-setup work by @Dananji in https://github.com/samvera-labs/ramp/pull/484
* Update version and CHANGELOG to reflect changes in latest release and tags by @Dananji in https://github.com/samvera-labs/ramp/pull/485
* Improve structured navigation user experience by @Dananji in https://github.com/samvera-labs/ramp/pull/483
* Wrap overflowing metadata text into new lines to avoid horizontal scroll by @Dananji in https://github.com/samvera-labs/ramp/pull/490
* Set player container aspect ratio to 16:9 for blank canvas messages by @Dananji in https://github.com/samvera-labs/ramp/pull/491
* Don't include 2nd bundled copy of css on demo page. Resolves #487 by @patrick-lienau in https://github.com/samvera-labs/ramp/pull/488
* Accessibility fixes to issues found in axe report by @Dananji in https://github.com/samvera-labs/ramp/pull/493
* Remove CSS classes for captions, fix CSS for placeholder canvas messages by @Dananji in https://github.com/samvera-labs/ramp/pull/495
* Transcript Search Functionality by @patrick-lienau in https://github.com/samvera-labs/ramp/pull/497
* Update Node in Circle-CI by @Dananji in https://github.com/samvera-labs/ramp/pull/506
* Update structure parsing to include root-level Range in display by @Dananji in https://github.com/samvera-labs/ramp/pull/496
* Fix a couple of minor bugs by @Dananji in https://github.com/samvera-labs/ramp/pull/507
* Enable/disable captions icon as needed when switching between canvases by @Dananji in https://github.com/samvera-labs/ramp/pull/505
* Fix seeking in safari by @Dananji in https://github.com/samvera-labs/ramp/pull/504
* Fix Ramp crashing when a SRT transcript is selected by @Dananji in https://github.com/samvera-labs/ramp/pull/511
* Update transcript search styling by @Dananji in https://github.com/samvera-labs/ramp/pull/510
* Fix a couple of demo data bugs by @Dananji in https://github.com/samvera-labs/ramp/pull/512
* Content search by @Dananji in https://github.com/samvera-labs/ramp/pull/515
* Render time offsets for cues that begin exactly at 0 by @cjcolvar in https://github.com/samvera-labs/ramp/pull/521
* showNotes Transcript prop for displaying NOTE comments (default: false) by @cjcolvar in https://github.com/samvera-labs/ramp/pull/520
* Improve VTT parsing by @cjcolvar in https://github.com/samvera-labs/ramp/pull/518
* Handle case when some transcripts have hits but others do not by @cjcolvar in https://github.com/samvera-labs/ramp/pull/522
* Mobile icons by @Dananji in https://github.com/samvera-labs/ramp/pull/527
* Native player by @Dananji in https://github.com/samvera-labs/ramp/pull/531
* Display previous/next buttons and timer for inaccessible canvases by @Dananji in https://github.com/samvera-labs/ramp/pull/529
* Adjust text highlight color for contrast in transcript search by @Dananji in https://github.com/samvera-labs/ramp/pull/533
* Preserve captions off state in native iOS player on play event by @Dananji in https://github.com/samvera-labs/ramp/pull/534
* Scroll transcript search hits within container by @Dananji in https://github.com/samvera-labs/ramp/pull/535
* Adjust content search when switching between transcripts by @Dananji in https://github.com/samvera-labs/ramp/pull/532
* Bump ws from 6.2.2 to 6.2.3 by @dependabot in https://github.com/samvera-labs/ramp/pull/528
* Use a debounce timer for content search request by @Dananji in https://github.com/samvera-labs/ramp/pull/544
* SRT/VTT timestamp validation to deny single digit hour in hh:mm... by @Dananji in https://github.com/samvera-labs/ramp/pull/546
* Fix parsing for timestamps with commas as decimal seperators by @Dananji in https://github.com/samvera-labs/ramp/pull/545
* Untimed search by @Dananji in https://github.com/samvera-labs/ramp/pull/542
* Use flexbox instead of grid to arrange transcript menu by @Dananji in https://github.com/samvera-labs/ramp/pull/547
* Update setTimeout in the debounce by @Dananji in https://github.com/samvera-labs/ramp/pull/550
* Remember active caption selection by @Dananji in https://github.com/samvera-labs/ramp/pull/549
* Fix previous/next button functionality with inaccessible item transitions by @Dananji in https://github.com/samvera-labs/ramp/pull/553
* Fix for multiple captions being selected in captions menu by @Dananji in https://github.com/samvera-labs/ramp/pull/555
* Fix prev/next button bugs in mobile devices by @Dananji in https://github.com/samvera-labs/ramp/pull/554
* Text search nav by @Dananji in https://github.com/samvera-labs/ramp/pull/558
* Add a title bar linking to external source to video player by @masaball in https://github.com/samvera-labs/ramp/pull/557
* Do not display timer when last item is inaccessible by @Dananji in https://github.com/samvera-labs/ramp/pull/563
* Add Thirdwave as a contributor by @Dananji in https://github.com/samvera-labs/ramp/pull/541
* Small tweak to top margin of horizontal volume slider thumb by @cjcolvar in https://github.com/samvera-labs/ramp/pull/562
* Fix grey overlay bug and related bugs in playlist item transitions by @Dananji in https://github.com/samvera-labs/ramp/pull/565
* Update no results message in transcript search by @masaball in https://github.com/samvera-labs/ramp/pull/568
* Ensure autoplay of next section when selecting inaccesible item by @masaball in https://github.com/samvera-labs/ramp/pull/569
* Fix regex to identify matches in content search response by @Dananji in https://github.com/samvera-labs/ramp/pull/566
* Fix split query bug in altReplace func by @Dananji in https://github.com/samvera-labs/ramp/pull/570
* Fix slow search by handling timing of updates and cache by @Dananji in https://github.com/samvera-labs/ramp/pull/571
* Check if manfiestState exists for search service parsing by @Dananji in https://github.com/samvera-labs/ramp/pull/572
* Update canvas duration on ready event by @Dananji in https://github.com/samvera-labs/ramp/pull/573
* Change vertical-align CSS for SVG by @Dananji in https://github.com/samvera-labs/ramp/pull/574
* Add `withCredentials` option to MediaPlayer component by @mbklein in https://github.com/samvera-labs/ramp/pull/576
* Read duration from either options or player property in progressbar by @Dananji in https://github.com/samvera-labs/ramp/pull/578
* Improve scrubbing and seeking by providing more space for scrubber and progress bar by @Dananji in https://github.com/samvera-labs/ramp/pull/579
* Allow progress bar updates with playback for audio in iOS by @Dananji in https://github.com/samvera-labs/ramp/pull/584
* Only reset isClicked if active structure item is set by @cjcolvar in https://github.com/samvera-labs/ramp/pull/592
* Vertical align lock icon for restricted struct items by @Dananji in https://github.com/samvera-labs/ramp/pull/589
* After an inaccessible item play the next item if user has started playback by @Dananji in https://github.com/samvera-labs/ramp/pull/581
* Update current time in audio player in iOS context by @Dananji in https://github.com/samvera-labs/ramp/pull/595
* Set accurate duration on progress bar creation by @Dananji in https://github.com/samvera-labs/ramp/pull/594
* Improve scrubbing in Safari with throttle and debounce on update events by @Dananji in https://github.com/samvera-labs/ramp/pull/597
* Update variables in progress component to refs to maintain accuracy with canvas updates by @Dananji in https://github.com/samvera-labs/ramp/pull/587
* Bug fix in desktop Safari scrubbing introduced in #597 by @Dananji in https://github.com/samvera-labs/ramp/pull/603

## v3.1.3 tag (04/10/2024) -> (This is not a Release in NPM)
*  Build active structure item classname into a single line  by @Dananji in https://github.com/samvera-labs/ramp/pull/478

## 3.1.2 (04/09/2024)
* Adjust marker display on UI when end > canvas duration by @Dananji in https://github.com/samvera-labs/ramp/pull/471

## 3.1.0 (04/04/2024)
* Bump ip from 1.1.8 to 1.1.9 by @dependabot in https://github.com/samvera-labs/ramp/pull/425
* Parse playlist homepage as positional urls into structure links by @Dananji in https://github.com/samvera-labs/ramp/pull/424
* Interpret null values in metadata as empty strings by @Dananji in https://github.com/samvera-labs/ramp/pull/427
* Test audiannotate by @Dananji in https://github.com/samvera-labs/ramp/pull/426
* Use caption label in menu, not filename by @masaball in https://github.com/samvera-labs/ramp/pull/439
* Change caption filtering to always use VideoJS' tracks instead of HLS tracks by @Dananji in https://github.com/samvera-labs/ramp/pull/428
* Fix auto advance and player crashing on Canvas change by @Dananji in https://github.com/samvera-labs/ramp/pull/432
* Use alternate CSS properties to set the Canvas message height by @Dananji in https://github.com/samvera-labs/ramp/pull/435
* Only display CC button for Video instances by @Dananji in https://github.com/samvera-labs/ramp/pull/438
* Bump sanitize-html from 2.10.0 to 2.12.1 by @dependabot in https://github.com/samvera-labs/ramp/pull/442
* Prevent iOS rejected promise from raising error boundary by @masaball in https://github.com/samvera-labs/ramp/pull/444
* Omit active tab navigation with left/right key events in hotkeys by @Dananji in https://github.com/samvera-labs/ramp/pull/445
* Add SRT support in Transcript component by @Dananji in https://github.com/samvera-labs/ramp/pull/446
* Fix active structure items blinking with user interactions by @Dananji in https://github.com/samvera-labs/ramp/pull/447
* Fix Video.js custom components crashing when initializing by @Dananji in https://github.com/samvera-labs/ramp/pull/448
* Update 'Scroll for More' message when StuctNav is resized by @masaball in https://github.com/samvera-labs/ramp/pull/450
* Remove HLS caption handling by @Dananji in https://github.com/samvera-labs/ramp/pull/443
* Bump follow-redirects from 1.15.4 to 1.15.6 by @dependabot in https://github.com/samvera-labs/ramp/pull/454
* Fix multiple captions being selected on initial load by @Dananji in https://github.com/samvera-labs/ramp/pull/455
* Remove track.off('change') for unknown cc in iOS context by @Dananji in https://github.com/samvera-labs/ramp/pull/456
* Prevent structure items getting highlighted for inaccessible items by @Dananji in https://github.com/samvera-labs/ramp/pull/459
* Display timespans past duration as links in StructuredNavigation by @Dananji in https://github.com/samvera-labs/ramp/pull/463

## 3.0.0 (02/19/2024)
* Fix UI for file download and fix bug in quality selector by @Dananji in https://github.com/samvera-labs/ramp/pull/160
* Use placeholderCanvas to render poster image by @Dananji in https://github.com/samvera-labs/ramp/pull/170
* Fix repo name references with repo rename by @Dananji in https://github.com/samvera-labs/ramp/pull/171
* Add previous/next section buttons to player icons by @Dananji in https://github.com/samvera-labs/ramp/pull/188
* Avalon related fixes by @Dananji in https://github.com/samvera-labs/ramp/pull/177
* Fix bug when switching canvas using previous/next buttons by @Dananji in https://github.com/samvera-labs/ramp/pull/193
* Fix prod data manifests to work with multiple domain names by @Dananji in https://github.com/samvera-labs/ramp/pull/195
* Metadata component by @Dananji in https://github.com/samvera-labs/ramp/pull/192
* UI updates to Ramp media player and videojs by @Dananji in https://github.com/samvera-labs/ramp/pull/199
* Add Styleguidist docs for MediaPlayer component by @Dananji in https://github.com/samvera-labs/ramp/pull/200
* Restructure by @Dananji in https://github.com/samvera-labs/ramp/pull/201
* Bug fix for canvas target resolution by @Dananji in https://github.com/samvera-labs/ramp/pull/203
* Bump semver from 5.7.1 to 5.7.2 by @dependabot in https://github.com/samvera-labs/ramp/pull/204
* Machine generated transcripts by @Dananji in https://github.com/samvera-labs/ramp/pull/194
* Bump word-wrap from 1.2.3 to 1.2.4 by @dependabot in https://github.com/samvera-labs/ramp/pull/208
* Supplemental files by @cjcolvar in https://github.com/samvera-labs/ramp/pull/206
* Accessibility improvements by @Dananji in https://github.com/samvera-labs/ramp/pull/209
* Fix VideoJS file download bug by @Dananji in https://github.com/samvera-labs/ramp/pull/211
* Transcripts fix by @Dananji in https://github.com/samvera-labs/ramp/pull/216
* Bump @adobe/css-tools from 4.2.0 to 4.3.1 by @dependabot in https://github.com/samvera-labs/ramp/pull/221
* Add top level auto-advance toggle component. by @cjcolvar in https://github.com/samvera-labs/ramp/pull/218
* Fix color contrast in links by @Dananji in https://github.com/samvera-labs/ramp/pull/224
* Markers firstpass by @Dananji in https://github.com/samvera-labs/ramp/pull/220
* Add handling for empty canvases within playlist manifests by @masaball in https://github.com/samvera-labs/ramp/pull/219
* Fix color contrast for links when hovered by @Dananji in https://github.com/samvera-labs/ramp/pull/230
* Fix broken scrubbing due to time tooltip styling by @Dananji in https://github.com/samvera-labs/ramp/pull/231
* Player respects auto advance toggle by @cjcolvar in https://github.com/samvera-labs/ramp/pull/242
* Add check for empty item to getItemId by @masaball in https://github.com/samvera-labs/ramp/pull/243
* Fix player css for zooming in demo site by @Dananji in https://github.com/samvera-labs/ramp/pull/248
* Add i18n support with language optin in VideoJS by @Dananji in https://github.com/samvera-labs/ramp/pull/235
* Handle case when range only has a single canvas child by @cjcolvar in https://github.com/samvera-labs/ramp/pull/241
* Replace videojs-hotkeys with builtin hotkeys function by @masaball in https://github.com/samvera-labs/ramp/pull/250
* Make the volume slider horizontal and sticky for audio player by @Dananji in https://github.com/samvera-labs/ramp/pull/251
* Add marker component by @cjcolvar in https://github.com/samvera-labs/ramp/pull/245
* Set no-auto-advance as default behavior in the player by @Dananji in https://github.com/samvera-labs/ramp/pull/253
* Latest build without dynamic imports for VideoJS languages by @Dananji in https://github.com/samvera-labs/ramp/pull/255
* Remove Avalon-Api-Key field from request by @Dananji in https://github.com/samvera-labs/ramp/pull/256
* StructuredNavigation UI for redesign by @Dananji in https://github.com/samvera-labs/ramp/pull/240
* Prevent retrieving currentTime when player is disposed by @masaball in https://github.com/samvera-labs/ramp/pull/257
* Center big play button on zoom by @Dananji in https://github.com/samvera-labs/ramp/pull/262
* New build by @cjcolvar in https://github.com/samvera-labs/ramp/pull/264
* Supplemental file display both Canvas and Manifest files independently by @Dananji in https://github.com/samvera-labs/ramp/pull/266
* Only prevent event default on hotkey actions by @masaball in https://github.com/samvera-labs/ramp/pull/267
* Make canvas-level items w/o mediafragment into spans instead of buttons by @Dananji in https://github.com/samvera-labs/ramp/pull/268
* Fix missing player for prev/next btns, getMediaFragment error for undefined URIs by @Dananji in https://github.com/samvera-labs/ramp/pull/270
* Bump @babel/traverse from 7.21.3 to 7.23.2 by @dependabot in https://github.com/samvera-labs/ramp/pull/271
* Add active section by @Dananji in https://github.com/samvera-labs/ramp/pull/275
* Fix structure auto scrolling by @Dananji in https://github.com/samvera-labs/ramp/pull/276
* Fix mismatching colors for button and span section items in structure by @Dananji in https://github.com/samvera-labs/ramp/pull/278
* Fix missing canvas console error by @masaball in https://github.com/samvera-labs/ramp/pull/279
* Add scrollbar override to enable constant display by @masaball in https://github.com/samvera-labs/ramp/pull/282
* Display placeholder canvas message for all empty manifests by @Dananji in https://github.com/samvera-labs/ramp/pull/277
* Fix structure display for section items with Canvas references by @Dananji in https://github.com/samvera-labs/ramp/pull/284
* Make tab labels focusable in the demo site by @Dananji in https://github.com/samvera-labs/ramp/pull/286
* Keep focus on next/previous buttons when using keyboard navigation by @Dananji in https://github.com/samvera-labs/ramp/pull/285
* Error boundary by @Dananji in https://github.com/samvera-labs/ramp/pull/291
* Display tracker when displaying playlist manifests by @Dananji in https://github.com/samvera-labs/ramp/pull/292
* Setting restricted message timer when using autoplay by @Dananji in https://github.com/samvera-labs/ramp/pull/300
* Use full relative path to lang json files and configure rollup for dynamic json imports by @cjcolvar in https://github.com/samvera-labs/ramp/pull/297
* Fix keyboard navigation for the tabbed view in demo site by @Dananji in https://github.com/samvera-labs/ramp/pull/301
* Bump @adobe/css-tools from 4.3.1 to 4.3.2 by @dependabot in https://github.com/samvera-labs/ramp/pull/302
* Initialize display timer always when autoplay is ON by @Dananji in https://github.com/samvera-labs/ramp/pull/304
* Transcript scroll fix by @Dananji in https://github.com/samvera-labs/ramp/pull/306
* Enable native text track behavior overriding default in VideoJS by @Dananji in https://github.com/samvera-labs/ramp/pull/307
* Player icon width, big-play button, demo site CSS changes for responsive UI by @Dananji in https://github.com/samvera-labs/ramp/pull/314
* Scroll active structure item into view within the component by @Dananji in https://github.com/samvera-labs/ramp/pull/313
* Display a message for unsupported transcript file formats by @Dananji in https://github.com/samvera-labs/ramp/pull/312
* Change canvas change trigger from a mutation observer to an event listener by @masaball in https://github.com/samvera-labs/ramp/pull/305
* Retrieve and use CSRF token in Marker component by @masaball in https://github.com/samvera-labs/ramp/pull/315
* Only add captions button to VideoJS when the IIIF Manifest has tracks by @Dananji in https://github.com/samvera-labs/ramp/pull/318
* Canvas metadata by @Dananji in https://github.com/samvera-labs/ramp/pull/311
* Fix autoscroll for structurednav, move autoscroll out to a utility function by @Dananji in https://github.com/samvera-labs/ramp/pull/324
* Show generic error message when manifest request fails by @Dananji in https://github.com/samvera-labs/ramp/pull/323
* Increase Default Timeout by @joncameron in https://github.com/samvera-labs/ramp/pull/317
* Add 2 new props to set start canvas and time, and map them to start property behavior from a IIIF Manifest by @Dananji in https://github.com/samvera-labs/ramp/pull/322
* Fix autoplay breaking when the last item is restricted by @Dananji in https://github.com/samvera-labs/ramp/pull/327
* Reduce media height by @masaball in https://github.com/samvera-labs/ramp/pull/328
* Use listener for hotkey support instead of VideoJS hotkeys by @masaball in https://github.com/samvera-labs/ramp/pull/326
* Add touch support for player actions to support Android browsers by @masaball in https://github.com/samvera-labs/ramp/pull/329
* Track scrubber by @Dananji in https://github.com/samvera-labs/ramp/pull/330
* Primarily rely on browser for file extension assignment by @masaball in https://github.com/samvera-labs/ramp/pull/319
* Disable update of custom timer and progress bar in iOS context by @masaball in https://github.com/samvera-labs/ramp/pull/336
* Remove no markers message in MarkersDisplay component by @Dananji in https://github.com/samvera-labs/ramp/pull/333
* Bump follow-redirects from 1.15.2 to 1.15.4 by @dependabot in https://github.com/samvera-labs/ramp/pull/337
* Remove id attributes from svg elements and condense g elements by @cjcolvar in https://github.com/samvera-labs/ramp/pull/341
* Add safe navigation and fallback in case there aren't any canvases in manifest by @cjcolvar in https://github.com/samvera-labs/ramp/pull/344
* Some accessibility fixes by @cjcolvar in https://github.com/samvera-labs/ramp/pull/340
* Provide test:debug script alias that makes it easy to debug with any dev tools by @cjcolvar in https://github.com/samvera-labs/ramp/pull/345
* Filter duplicated captions instead of switching off native text track behavior in VideoJS by @Dananji in https://github.com/samvera-labs/ramp/pull/353
* Read canvas summary and render as data attribute alongside label by @cjcolvar in https://github.com/samvera-labs/ramp/pull/350
* Add fade out and message to indicate scrolling of structured nav by @masaball in https://github.com/samvera-labs/ramp/pull/348
* Fix breaking hotkeys after switching Canvas by @Dananji in https://github.com/samvera-labs/ramp/pull/359
* Fix playback issues in Safari by @Dananji in https://github.com/samvera-labs/ramp/pull/356
* Fix next Canvas button click by @Dananji in https://github.com/samvera-labs/ramp/pull/358
* Display transcript content on first load by @Dananji in https://github.com/samvera-labs/ramp/pull/360
* Fix scale for section buttons, to match with other player icons by @Dananji in https://github.com/samvera-labs/ramp/pull/361
* Add padding to playlist structure nav by @Dananji in https://github.com/samvera-labs/ramp/pull/364
* Make CSS for scrolling in structure work with adjustable height in host apps by @Dananji in https://github.com/samvera-labs/ramp/pull/365
* Improve handling of download filenames in Transcript and Supplemental File components by @masaball in https://github.com/samvera-labs/ramp/pull/362
* Give transcript items "role=listitem" attribute by @masaball in https://github.com/samvera-labs/ramp/pull/368
* Override Safari's native text track functionality by @Dananji in https://github.com/samvera-labs/ramp/pull/367
* Replace pointer handlers for transcript auto-scroll check with a checkbox by @Dananji in https://github.com/samvera-labs/ramp/pull/371
* Fix playback and transcript scroll for mobile/tablet devices by @Dananji in https://github.com/samvera-labs/ramp/pull/369
* Remove fade from StructNav by @masaball in https://github.com/samvera-labs/ramp/pull/373
* Stick scroll to see more text into one line by @Dananji in https://github.com/samvera-labs/ramp/pull/374
* Use touchpoints instead of iPad regex to detect iPads by @Dananji in https://github.com/samvera-labs/ramp/pull/376
* Disable volume slider for mobile devices by @masaball in https://github.com/samvera-labs/ramp/pull/378
* Fix hotkeys when focused on VideoJS's native controls by @Dananji in https://github.com/samvera-labs/ramp/pull/380
* Remove transition when horizontal volume becomes inactive by @masaball in https://github.com/samvera-labs/ramp/pull/381
* Force initialization of canvas to start time specified in manifest when canvas index changes by @cjcolvar in https://github.com/samvera-labs/ramp/pull/386
* Disable time updates when media has ended by @masaball in https://github.com/samvera-labs/ramp/pull/389
* Only force canvases to start from begining in playlist contexts by @Dananji in https://github.com/samvera-labs/ramp/pull/388
* Revert to label so toggling works and include aria-labelledby by @cjcolvar in https://github.com/samvera-labs/ramp/pull/391
* Remove z-index for player control bar in mobile devices, add an additional check for inactivity by @Dananji in https://github.com/samvera-labs/ramp/pull/392
* Show track scrubber in playlist context by @Dananji in https://github.com/samvera-labs/ramp/pull/387
* Add key to track map in VideoJS initializer by @masaball in https://github.com/samvera-labs/ramp/pull/393
* Assign id value to empty VideoJS instance by @masaball in https://github.com/samvera-labs/ramp/pull/397
* Update autoadvancetoggle component styleguidist docs by @Dananji in https://github.com/samvera-labs/ramp/pull/398
* Check if player is paused before firing ended events by @masaball in https://github.com/samvera-labs/ramp/pull/403
* Use localStorage to make volume and quality settings sticky by @cjcolvar in https://github.com/samvera-labs/ramp/pull/395
* Show captions in native player in iOS by @Dananji in https://github.com/samvera-labs/ramp/pull/396
* Fix broken hotkeys when switching Canvas and for mute in Chrome by @Dananji in https://github.com/samvera-labs/ramp/pull/409
* Force text track font size in mobile contexts by @masaball in https://github.com/samvera-labs/ramp/pull/411
* Make muted be a sticky setting by @cjcolvar in https://github.com/samvera-labs/ramp/pull/414
* Fix fullscreen crashing in Safari in iPad on iOS 17 by @Dananji in https://github.com/samvera-labs/ramp/pull/412
* Fix samples for transcripts docs in Styleguidist by @Dananji in https://github.com/samvera-labs/ramp/pull/416
* Use safe navigator when setting quality by @masaball in https://github.com/samvera-labs/ramp/pull/417
* Override VJS caption font to prevent double spacing by @masaball in https://github.com/samvera-labs/ramp/pull/418
* iOS double captions fix by @Dananji in https://github.com/samvera-labs/ramp/pull/415
* Fix sticky mute when switching from video to audio in mobile by @Dananji in https://github.com/samvera-labs/ramp/pull/419
* README updates by @Dananji in https://github.com/samvera-labs/ramp/pull/421

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
