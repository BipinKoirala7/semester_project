import { setLocalStorage } from "../Js/main.js";

const topicList = document.getElementById("topic-list");

// this function gets the blog topics from the data.json
async function getBlogPosts() {
  const response = await fetch("../data.json");
  const data = await response.json();
  return data.blog;
}

// this function shows the blog topics in the list in the blog page
async function showBlogTopics() {
  const data = await getBlogPosts();
  data.forEach((blog) => {
    const { blogid, writtenDate, title, overview, readTime, mainTopic, image } =
      blog;
    topicList.innerHTML += `
        <div id="blog-card" data-blogId=${blogid}>
            <div id="blog-card-image-container" class="flex-center">
                <img id="blog-card-img" src=${image.url} alt="blog-image" />
            </div>
            <div id="blog-card-info" class="flex-column">
                <div id="blog-card-title" class="flex-column">
                    <p id="blog-card-title" class="medium-title">${title}</p>
                    <p id="blog-card-description" class="text-ellipsis">${overview}</p>
                </div>
                <div id="blog-card-tags">
                    <div class="tag flex-center">
                        <img class="icon" src="https://s2.svgbox.net/octicons.svg?ic=book&&color=54b783" />
                        <p>${readTime} min read</p>
                    </div>
                    <div class="tag flex-center">
                        <img class="icon" src="https://s2.svgbox.net/materialui.svg?ic=date_range&&color=54b783" />
                        <p>${writtenDate}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
  });
}

async function main() {
  await showBlogTopics();
  const blogCards = document.querySelectorAll("#blog-card");
  blogCards.forEach((blogCard) => {
    blogCard.onclick = () => {
      setLocalStorage("selectedBlogId", blogCard.dataset.blogid);
      window.location.pathname = "./Html/article.html";
    };
  });
}
main();
