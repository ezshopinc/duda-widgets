let totalProducts = 0;
const nbToDisplay = 4;
let htmlOutput = "";

let url = 'https://app.ecwid.com/api/v3/92236755/categories';
const options = {
    method: 'GET',
    headers: { accept: 'application/json', Authorization: 'Bearer public_J8WYSCDiUAyMpqcY1ERBsBk98NtDqQzv' }
};

const queryParams = {
    parent: '0',
};

const queryString = new URLSearchParams(queryParams).toString();

url = url + '?' + queryString;


fetch(url, options)
    .then(res => res.json())
    .then(async json => {
        totalCategories = json.count
        let productId = 0;
        for (let i = 0; i < totalCategories; i++) {
            productId = json.items[i].id
            console.log(json.items[0])
            productNameForUrl = json.items[i].name.replace(/ /g, "-");
            htmlOutput += `<li class="dropdown"><a href="/store#!/${productNameForUrl}/c/${json.items[i].id}">${json.items[i].name}</a>`
            
            
            htmlOutput += await getChildCategories(productId);
            
            htmlOutput +=`</li>`
        }
        htmlOutput += `
              <li class="dropdown">
                  <a href="/store#!/~/search">Shop All</a>
                  <ul class="dropdown-content">
                    <li class="dropdown-element">
                        <a href="/store#!/~/search">Shop All</a>
                    </li>
                  </ul>
              </li>`
        return htmlOutput;
    }).then(htmlOutput => {
        console.log(htmlOutput)
    })
    .catch(err => console.error('error:' + err));


    // getChildCategories(156257840);
    

async function getChildCategories(parentId) {
    let htmlOutput = "";
    let url = 'https://app.ecwid.com/api/v3/92236755/categories';
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: 'Bearer public_J8WYSCDiUAyMpqcY1ERBsBk98NtDqQzv' }
    };

    const queryParams = {
        parent: parentId,
    };

    const queryString = new URLSearchParams(queryParams).toString();

    url = url + '?' + queryString;
    return fetch(url, options)
        .then(res => res.json())
        .then(json => {
            totalCategories = json.count
            let productId = 0;
            htmlOutput += `<ul class="dropdown-content">`
            for (let i = 0; i < totalCategories; i++) {
                productId = json.items[i].id
                //console.log(json.items[i].id, json.items[i].name)
                productNameForUrl = json.items[i].name.replace(/ /g, "-");
                htmlOutput += `
                <li class="dropdown-element">
                    <a href="/store#!/${productNameForUrl}/c/${json.items[i].id}">${json.items[i].name}</a>
                </li>`
            }
            htmlOutput += `</ul>`
            // console.log(htmlOutput)
            return htmlOutput;
        })
        .catch(err => console.error('error:' + err));
}