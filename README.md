trellists
=========

Trellists: Trello Lists Master


* Extension: https://chrome.google.com/webstore/detail/trellists-trello-lists-ma/dgnlcodfeenegnifnpcabcclldoceeml
* Code: https://github.com/VladSavitsky/trellists



Allow to hide and show lists at Trello's boards.
Trello.com is the really great tool but if you have a lot of Lists it will be hard to manage them or you should use horizontal scroll all the time.

This extension solves problem of horizontal scrolling and makes easier management of boards with a huge amount of Lists. Main features:
* Adds a nice bar at the top where all existing Lists are shown;
* Hide and show Lists at board by clicking List name in the bar;
* Status of each List represented by color: grey for hidden List and white for shown.

### Road Map:
* Store also name of board to avoid conflicts for the lists with the same names on different boards.



### Updates:

#### 2.8
* Removed useless 'storage' permission.

#### 2.7
* Minor change. Removed useless 'tabs' permission.

#### 2.6
* Fixed issue when status of list wasn't restored from localStorage when switched to new board and then back again.

#### 2.5
* Fixed bug with single qoutes.
* Improved speed of menu rendering.
* Added mutation-summary library.

#### 2.0
* Fixed bugs https://trello.com/c/xNzKkl72 and https://trello.com/c/XolHwvsc which blocked adding new cards and hides horizontall scroll bar if board contain a huge amount of lists.

#### 1.9
* Minor fixes and improvements.

#### 1.8
* Fixed bug with wrong color of tabs for newly created Lists.
* Improved behavior of 'Hide all/Show all' button.

#### 1.7
* Added ability to hide all and show all Lists in one clik. Now you can easily hide all lists then show only one and manage cards in this list without any scrolling. Nice!

#### 1.6
* Fixed automatic injection of extension to Trello's page. Now list of all lists will appear automatically for all Boards.
* Added new screenshots.

#### 1.5
* Implemented storing status of List (hidden/shown) for each List at board and correct status in top Menu for each tab (which represents actual tab).

#### 1.4
* Implemented integration with 'Points for Trello' extension which updates Lists headers each 2 seconds and slow down whole page if there are a lot of lists.
* Removed jQuery fadeIn effect for top bar to avoid flashing.

#### 1.3
* Fixed a lot of bugs.
* Increased speed of application.
* Improved UI.
* Changed styles of Bar to look more like Trello's native elements.
* Bar in header now appears just after page load automatically.
* Bar updates on List creation/removing/title update/archiving.
* Implemented support of drag-and-drop List's movements.

#### 1.1
* Updated to newest version of trello.com.
* Better UI.
* Removed useless HTML.

#### 1.0
* Shows lists in one row in the header.
