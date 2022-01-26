console.log("deleting history")
history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(0);
    };