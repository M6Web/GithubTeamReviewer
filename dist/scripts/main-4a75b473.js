angular.module("gtrApp.config",[]).constant("config",{refreshInterval:300,teams:{burton:{members:["fabdsp","mikaelrandy","mojoLyon","omansour","t-geindre"],orgs:["M6Web"],token:"cdeff2251719365dba3c3c2534f6783804951c62"},cytron:{members:["fdubost","oziks","adriensamson"],orgs:["M6Web"],token:"cdeff2251719365dba3c3c2534f6783804951c62"}}}),angular.module("gtrApp",["ngRoute","gtrApp.config"]).config(["$routeProvider","config",function(e,t){e.when("/:team",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{team:["$q","$route","config",function(e,t,r){var n=e.defer();return r.teams[t.current.params.team]?n.resolve(t.current.params.team):n.reject("Team does not exist"),n.promise}]}}).otherwise({redirectTo:"/"+Object.keys(t.teams)[0]})}]),angular.module("gtrApp").provider("PullFetcher",function(){var e="https://api.github.com";this.$get=["$http","$q",function(t,r){var n,a,s,o={pulls:{},setTeam:function(t){n=t,a=t.apiUrl||e,s={},t.token&&(s={Authorization:"token "+t.token});for(var r in this.pulls)delete this.pulls[r]},refreshPulls:function(){var e=this;angular.forEach(e.pulls,function(t,r){l(t.url).then(function(t){"closed"===t.data.state&&delete e.pulls[r]})}),n.orgs.forEach(function(e){f(a+"/orgs/"+e)}),"undefined"!=typeof n.members&&n.members.forEach(function(e){f(a+"/users/"+e)})}},l=function(e){return t({url:e,headers:s})},u=function(e){return-1!==(n.members||[e.user.login]).indexOf(e.user.login)},i=function(e){return-1!==(n.projects||[e.name]).indexOf(e.name)},c=function(e){return l(e.statuses_url).then(function(t){e.statuses=t.data})},p=function(e){return l(e.pulls_url.replace("{/number}","")).then(function(e){var t=e.data.filter(u);return r.all(t.map(c)).then(function(){return t})})},f=function(e,t){void 0===t&&(t=1),l(e+"/repos?per_page=100&page="+t).then(function(r){var n=r.data.filter(i);n.forEach(function(e){p(e).then(function(e){e.forEach(function(e){o.pulls[e.id]=e})})}),r.data.length&&f(e,t+1)})};return o}]}),angular.module("gtrApp").controller("MainCtrl",["$scope","$location","$interval","PullFetcher","config","team",function(e,t,r,n,a,s){e.pulls=n.pulls,e.teams=a.teams,e.team=s,e.descendingOrder="undefined"!=typeof a.teams[s].descendingOrder?a.teams[s].descendingOrder:!0,e.toArray=function(e){var t=[];return angular.forEach(e,function(e){t.push(e)}),t},e.$watch("team",function(e){t.path(e)}),e.$on("$destroy",function(){r.cancel(o)});var o=r(function(){n.refreshPulls()},1e3*a.refreshInterval);n.setTeam(e.teams[s]),n.refreshPulls()}]),function(e){try{e=angular.module("gtrApp")}catch(t){e=angular.module("gtrApp",[])}e.run(["$templateCache",function(e){e.put("views/main.html",'<header class="header-top"><a href="http://github.com/m6web/GithubTeamReviewer">Github Team Reviewer</a> by <a href="http://tech.m6web.fr">M6Web</a><select ng-model="team" ng-options="teamName as teamName for (teamName, team) in teams"></select></header><div class="container"><ul class="pulls"><li ng-repeat="pr in toArray(pulls) | orderBy:\'updated_at\':descendingOrder" ng-class="pr.statuses[0].state" class="status"><span class="link"><img class="avatar" ng-src="{{ pr.user.avatar_url}}" title="{{ pr.user.login }}"><a ng-href="{{pr.html_url}}">#{{ pr.number }} {{ pr.title }}</a></span> <span class="pull-right"><span class="repo"><a ng-href="{{pr.head.repo.html_url}}">{{ pr.head.repo.full_name }}</a></span> <span class="date">{{pr.updated_at | date:"dd/MM/yyyy"}}</span></span><div class="clearer">&nbsp;</div></li></ul></div>')}])}();