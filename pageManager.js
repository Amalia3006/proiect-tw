const nunjucks = require('nunjucks')

let views = {};
const viewDir = "./views";

function init() {
    nunjucks.configure(viewDir);
    let templates = ["firstPageNoLog.njk",
                    "firstPageLoggedin.njk",
                    "pageJobs.njk",
                    "pageOportunity.njk",
                    "pageProfile.njk",
                    "pageSignIn.njk",
                    "pageSignUp.njk"];
    
    for(template of templates) {
        let templateKey = String(template).split(".")[0];
        try {
            views[templateKey] = nunjucks.render(template);
        } catch (error) {
            views[templateKey] = null;
        }
    }

    views["404page"] = nunjucks.render("404page.html");
}


module.exports = {views, init, viewDir};

