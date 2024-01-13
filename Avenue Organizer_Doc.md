Movsar Omarov created Avenue Organizer website, where you can create own discussions.
Every of them has own web page on which you can discuss about a topic.

Website consists of:
  - a talks web page, where you can see a list of talks and can join by clicking on them
  - topic web pages on which every participant can say his views, opinions etc.

Movsar Omarov divided a code into frontend-side and backend (localhost). 
You can imagine map of my website as tree data structure 
(talks web page is a root and topic web pages are its childs).
All of the datas will be stored on json-file (talks.json).
I chose WebSockets as connection between client and server, to update web pages fast.
