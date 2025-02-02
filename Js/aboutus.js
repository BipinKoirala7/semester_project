const memberCardContainer = document.querySelector("#member-card-container");

// this function gets the members info
async function getMemebrInfo() {
  const response = await fetch("../data.json");
  const data = await response.json();
  return data.members;
}

// this function shows the members in the about us page
function showMemebrs(data) {
  for (const info of data) {
    const { name, image, socialMedia, about,skills,education } = info;
    let iconHtml = ``;
    let languagesHTML = ``;
    let membereducationHTML = ``;
    skills.languages.forEach(item => {
      languagesHTML += `
        <p style="padding:.25rem .5rem; background-color:var(--secondary);border-radius:.5rem">${item}</p>
      `
    })
    education.forEach(item => {
      membereducationHTML+= `
        <div class="member-education flex-column">
          <p class="medium-title text-capitalize">${item.name}</p>
          <p class="">${item.school}</p>
        </div>
      `
          })
    for (const media of socialMedia) {
      const { media_name, id, url, media_icon_url } = media;
      iconHtml += `
        <div class="media-icon-container" class="${media_name}-container" onclick="window.open('${url}')">
            <img
            src=${media_icon_url}
            alt=""
            class="icon"
            />
            <p class="media-id">${id}</p>
        </div>
      `;
    }

    memberCardContainer.innerHTML += `
        <div class="member-card" id="member-card" data-id="${name}">
            <img data-member-name="${name}" src=${image[0].url} class="about-background-img" alt="image of a member"/>
            <div class="member-information flex-column">
              <p class="title" id="member-name">${name}</p>
            </div>
            <div class="social-media-icons flex-column">
                ${iconHtml}
            </div>
            <div class="member-info-container flex-column">
                <p class="member-about">${about}</p>
                <div class="member-specs-container">
                  <div class="member-skills">
                    <div class="flex-column">
                      <p class="medium-title">Skills</p>
                      <p>${skills.speciality}</p>
                    </div>
                    <div class="flex-column" style="gap:.5rem">
                      <p class="medium-title">Languages</p>
                      <div style="display:flex;gap:.25rem">${languagesHTML}</div>
                    </div>
                  </div>
                  <div class="member-education">
                    ${membereducationHTML}
                  </div>
                </div>
            </div>
        </div>
        `;
  }
}

async function main() {
  const data = await getMemebrInfo();
  showMemebrs(data);
  document.querySelectorAll(".about-background-img").forEach((element) => {
    element.addEventListener("click", () => {
     element.parentElement.children[3].classList.add("display");
    });
  });
  document.querySelectorAll(".member-info-container").forEach((element) => {
    element.addEventListener("dblclick", () => {
      element.classList.remove("display");
    });
  });

  document.querySelectorAll(".member-card").forEach((element) => {
    element.addEventListener("mouseleave", () => {
      const memberInfoContainer = element.querySelector(
        ".member-info-container"
      );
      if (memberInfoContainer) {
        memberInfoContainer.classList.remove("display");
      }
    });
  });
}
main();
