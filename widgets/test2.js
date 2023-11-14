
(async function () {
    let categories = await fetchAllCategories()
    let parents = findParents(categories);
    let childs = [];

    for (let i = 0; i < parents.length; i++) {
        parents[i].childs = [];
        childs = await findChilds(categories, parents[i].id);
        parents[i].childs = parents[i].childs.concat(childs);


        for (let j = 0; j < parents[i].childs.length; j++) {
            parents[i].childs[j].childs = [];
            let subChilds = await findChilds(categories, parents[i].childs[j].id);
            parents[i].childs[j].childs =  parents[i].childs[j].childs.concat(subChilds);
        }
    }

    //Dipslay parents with their childs names
    for (let i = 0; i < parents.length; i++) {
        console.log(parents[i].name)
        for (let j = 0; j < parents[i].childs.length; j++) {
            console.log("    ", parents[i].childs[j].name, parents[i].childs[j].childs.length)
            for (let k = 0; k < parents[i].childs[j].childs.length; k++) {
                console.log("           ", parents[i].childs[j].childs[k].name)
            }
        }
    }

    let htmlOutput = "";
    for (let i = 0; i < parents.length; i++) {
        console.log(parents[i].name)
        htmlOutput += `<li class="dropdown"><a href="/store#!/${parents[i].name}">${parents[i].name}</a>`
        htmlOutput += `<ul class="dropdown-content">`
        for (let j = 0; j < parents[i].childs.length; j++) {
            console.log("    ", parents[i].childs[j].name)
            htmlOutput += `<li class="dropdown-element"><a href="/store#!/${parents[i].childs[j].name}">${parents[i].childs[j].name}</a></li>`
            for (let k = 0; k < parents[i].childs[j].childs.length; k++) {
                htmlOutput += `<li class="dropdown-element"><a href="/store#!/${parents[i].childs[j].childs[k].name}">${parents[i].childs[j].childs[k].name}</a></li>`
            }
        }
        htmlOutput += `</ul>`
    }
    htmlOutput += `</li>`
    //console.log(htmlOutput)

})();


function findParents(categories) {
    let parents = [];
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].parentId == 0 || categories[i].parentId == null) {
            parents.push(categories[i])
        }
    }
    return parents;
}

async function findChilds(json, parentID) {
    return new Promise((resolve, reject) => {
        try {
            let childs = [];
            for (let i = 0; i < json.length; i++) {
                if (json[i].parentId == parentID) {
                    childs.push(json[i])
                }
            }
            resolve(childs);
        } catch (error) {
            reject(error);
        }
    });
}

async function fetchAllCategories() {

    let categories = [];

    let url = 'https://app.ecwid.com/api/v3/92236755/categories';
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: 'Bearer public_J8WYSCDiUAyMpqcY1ERBsBk98NtDqQzv' }
    };
    const queryParams = {
        // parent: '0',
    };
    const queryString = new URLSearchParams(queryParams).toString();
    url = url + '?' + queryString;

    await fetch(url, options)
        .then(res => res.json())
        .then(async json => {
            console.log("ref:", json.total)

            nbAPIcalls = Math.ceil(json.total / 100);

            //Add First 100 categories
            //categories = categories.concat(json.items);
            console.log(nbAPIcalls)
            return nbAPIcalls;

        })
        .then(async nbAPIcalls => {

            const options = {
                method: 'GET',
                headers: { accept: 'application/json', Authorization: 'Bearer public_J8WYSCDiUAyMpqcY1ERBsBk98NtDqQzv' }
            };

            for (let i = 0; i < nbAPIcalls; i++) {

                //TODO: Do not redeclare every time
                let url = 'https://app.ecwid.com/api/v3/92236755/categories';
                let offset = i * 100;
                let queryParams = {
                    offset: offset,
                };
                console.log("offset:", i * 100)
                let queryString = new URLSearchParams(queryParams).toString();

                url = url + '?' + queryString;
                console.log(url)
                await fetch(url, options)
                    .then(res => res.json())
                    .then(json => {
                        categories = categories.concat(json.items);
                        console.log(json.count)
                        //console.log(categories.length)
                    })
                    .catch(err => console.error('error:' + err));
            }
            console.log("total:", categories.length)
        })
        .catch(err => console.error('error:' + err));

    return categories;
}
// async function getChildCategories(parentId) {
//     let htmlOutput = "";
//     let url = 'https://app.ecwid.com/api/v3/92236755/categories';
//     const options = {
//         method: 'GET',
//         headers: { accept: 'application/json', Authorization: 'Bearer public_J8WYSCDiUAyMpqcY1ERBsBk98NtDqQzv' }
//     };

//     const queryParams = {
//         parent: parentId,
//     };

//     const queryString = new URLSearchParams(queryParams).toString();

//     url = url + '?' + queryString;
//     return fetch(url, options)
//         .then(res => res.json())
//         .then(json => {
//             totalCategories = json.count
//             let productId = 0;
//             htmlOutput += `<ul class="dropdown-content">`
//             for (let i = 0; i < totalCategories; i++) {
//                 productId = json.items[i].id
//                 //console.log(json.items[i].id, json.items[i].name)
//                 productNameForUrl = json.items[i].name.replace(/ /g, "-");
//                 htmlOutput += `
//                 <li class="dropdown-element">
//                     <a href="/store#!/${productNameForUrl}/c/${json.items[i].id}">${json.items[i].name}</a>
//                 </li>`
//             }
//             htmlOutput += `</ul>`
//             // console.log(htmlOutput)
//             return htmlOutput;
//         })
//         .catch(err => console.error('error:' + err));
// }