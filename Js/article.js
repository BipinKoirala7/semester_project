import { getLocalStorage } from "../Js/main.js";

const articleContainer = document.getElementById("article-container");

// this function gets the articel data with id which is stored in the data.json
async function getArticle(articleId) {
    const response = await fetch("../data.json");
    const data = await response.json();
    return data.blog.filter(blog => blog.blogid === articleId)[0];
}

// this function shows the articel in article page
async function showArticle(articleId) {
    const article = await getArticle(articleId)
    const { writtenDate, title, overview, image, section, conclusion } = article;
    document.title = title;
    articleContainer.innerHTML = `
        <p id="article-date" class="title">${writtenDate}</p>
        <p id="article-title" class="flex-column flex-center big-title">${title}</p>
        <img src=${image.url} alt="" class="article-img">
        <p class="article-text">${overview}</p>
        <div id="article-section" class="flex-column">
            ${
        section.map(item => {
            const {title,image,content } = item;
            return `
                <div id="section" class="flex-column flex-center">
                    <p class="medium-title" style="text-align:left">${title}</p>
                    <img src=${image.url} class="article-img"/>
                    <p class="article-text">${content}</p>
                </div>
            `
                })
            }
        </div>
        <div id="article-conclusion-container" class="flex-column">
            <p class="medium-title">Conclusion</p>
            <p class="article-text">${conclusion}</p>
        </div>
    `;
}

function main() {
    const articleId = getLocalStorage("selectedBlogId");
    showArticle(articleId);
}

main()