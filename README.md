# Pherrit


![screenshot](screenshot.png)

A browser extension that modifies Phabricator workboards for the Wikimedia Foundation to show Gerrit tickets related to each task. Gerrit tickets are linked to Phab tasks by writing the words `Bug: [[ticket number]]` in the Gerrit commit message.

NOTE: So far, this is more of a proof-of-concept than a respectable piece of software.

## TODO

### Code Quality
* [ x ] Add linter
* [ ] Write the JSDocs
* [ x ] Introduce Babel & webpack
    * [ X ] Write the webpack config
* [ x ] Put the core business logic into a `lib` directory and leave the `chrome` dir for extension specific stuff
* [ ] Figure out a testing strategy

### Bugs
* [ ] What happens when a patch is related to more than one ticket?
* [ ] Gerrit has a limit on query parameters, split the query into multiple network requests and wait for them all to resolve before continuing (hope throttling is not an issue)

### Features
* [ X ] Order the patches by "most needing code-review" so unreviewed & -1, first. Merged, abandoned last (or something like that)
* [ X ] Collapse merged patches when there are too many of them
* [ X ] Add more styles for WIP, merged, abandoned patches (lay them all out in all combinations)
* [ X ] Add a "+" before the number when something is +1 or +2
* [ ] Add a chrome button to turn it on and off
