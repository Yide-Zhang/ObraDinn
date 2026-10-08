const ICON_BASE = "assets/app_icons/";

const resources = [
  {
    id: "save",
    icon: "icon_save.png",
    index: "01",
    tag: "工具",
    title: "存档管理器",
    desc: "备份、恢复与整理《Return of the Obra Dinn》的存档文件，让每一次调查进度都能随时取回。",
    platform: "Windows / macOS",
    repo: "Yide-Zhang/ObraDinn-SaveTool",
    links: [{ label: "GitHub 项目", href: "https://github.com/Yide-Zhang/ObraDinn-SaveTool" }],
  },
  {
    id: "anti_motion_sickness",
    icon: "icon-anti_motion_sickness.png",
    index: "02",
    tag: "辅助",
    title: "防晕动辅助",
    desc: "降低画面晃动带来的不适感，让长时间的推理调查更舒适。",
    platform: "Windows（暂不支持 macOS）",
    repo: "Jobus0/ObraDinn-AntiMotionSickness",
    links: [
      { label: "GitHub 项目", href: "https://github.com/Jobus0/ObraDinn-AntiMotionSickness" },
    ],
    note: "本资源并非本站作者制作，由 Jobus0 开发。",
  },
  {
    id: "cn_refined",
    icon: "icon-cn_refined.png",
    index: "03",
    tag: "汉化",
    title: "中文精修",
    desc: "精修与润色游戏文本，让措辞更为准确，从而使你的推理体验趋于完美。另有和谐敏感文字功能，可使直播、上传视频不受拦阻。",
    platform: "Windows / macOS",
    repo: "Yide-Zhang/ObraDinn-CN_Refined",
    links: [{ label: "GitHub 项目", href: "https://github.com/Yide-Zhang/ObraDinn-CN_Refined" }],
  },
  {
    id: "difficulty",
    icon: "icon-difficulty.png",
    index: "04",
    tag: "辅助",
    title: "难度调整",
    desc: "提高游戏验证下落的数量阈值。有多个档位可选。",
    platform: "Windows / macOS",
    repo: "Yide-Zhang/ObraDinn-HardCore",
    links: [
      { label: "GitHub 项目", href: "https://github.com/Yide-Zhang/ObraDinn-HardCore" },
      {
        label: "百度网盘",
        href: "https://pan.baidu.com/s/1SdNoex1_KAeTDF8iUNc8Sg?******",
        mirror: true,
      },
      {
        label: "123 云盘",
        href: "https://4006811727.share.123pan.cn/123pan/R7kkwh-YUrhh?******",
        mirror: true,
      },
      { label: "夸克网盘", href: "https://pan.quark.cn/s/bed6d36b61ed?******", mirror: true },
      {
        label: "Google Drive",
        href: "https://drive.google.com/drive/folders/1At3t12pNFlFYj3nFGkzxBVu9ICnyWAid?usp=sharing",
        mirror: true,
      },
    ],
    note: "除 GitHub 外另提供四个网盘镜像，任选其一即可。",
  },
  {
    id: "hints_and_check",
    icon: "icon-hints_and_check.png",
    index: "05",
    tag: "辅助",
    title: "提示与验证",
    desc: "可给出逐步提示并按照游戏逻辑验证你的猜想。",
    platform: "Windows / macOS",
    repo: "Yide-Zhang/ObraDinn-HintsAndCheck",
    links: [
      { label: "GitHub 项目", href: "https://github.com/Yide-Zhang/ObraDinn-HintsAndCheck" },
      { label: "网页版", href: "https://yide-zhang.github.io/ObraDinn-HaC" },
    ],
    note: "网页版无需安装，直接在浏览器中使用。",
  },
  {
    id: "instructor",
    icon: "icon-instructor.png",
    index: "06",
    tag: "辅助",
    title: "无剧透辅助",
    desc: "面向新上船调查员的入门指引，讲解基本机制、笔记用法、游戏机制和调查方法。",
    platform: "Windows / macOS",
    repo: "Yide-Zhang/ObraDinn-Instructor",
    links: [{ label: "GitHub 项目", href: "https://github.com/Yide-Zhang/ObraDinn-Instructor" }],
  },
  {
    id: "teleporter",
    icon: "icon-teleporter.png",
    index: "07",
    tag: "工具",
    title: "场景传送",
    desc: "可以在不同闪回之间传送，减少重复往返，把时间留给推理本身。",
    platform: "Windows（暂不支持 macOS）",
    repo: "Yide-Zhang/ObraDinn_Teleport-ChineseVer",
    links: [
      {
        label: "中文版项目",
        href: "https://github.com/Yide-Zhang/ObraDinn_Teleport-ChineseVer",
      },
      {
        label: "支持原作者",
        href: "https://www.nexusmods.com/returnoftheobradinn/mods/7",
        mirror: true,
      },
    ],
    note: "原作由 Leuthil 制作，中文版为移植版本；有条件的话请到 Nexus Mods 支持原作者。",
  },
  {
    id: "wiki",
    icon: "icon-wiki.png",
    index: "08",
    tag: "资料",
    title: "Obra Dinn Wiki",
    desc: "完整的英文维基资料库，可查阅人物、事件、船只结构与世界观设定。",
    links: [
      {
        label: "打开维基",
        href: "https://obradinn.fandom.com/wiki/Return_of_the_Obra_Dinn_Wiki",
      },
    ],
  },
];

const iconRow = document.querySelector("#icon-row");
const panel = document.querySelector("#resource-panel");
let activeId = resources[0].id;

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderRow() {
  iconRow.innerHTML = resources
    .map((item) => {
      const isActive = item.id === activeId;
      return `<button
        class="icon-button${isActive ? " is-selected" : ""}"
        type="button"
        role="tab"
        id="tab-${item.id}"
        aria-controls="resource-panel"
        aria-selected="${isActive}"
        tabindex="${isActive ? 0 : -1}"
        data-id="${item.id}"
      >
        <span class="icon-frame"><img src="${ICON_BASE}${item.icon}" alt="${escapeHtml(item.title)}" /></span>
        <span class="icon-label">${item.index}</span>
      </button>`;
    })
    .join("");
}

function renderPanel() {
  const item = resources.find((entry) => entry.id === activeId);
  const releaseLink = item.repo
    ? `<a class="square-button" href="https://github.com/${item.repo}/releases/latest" target="_blank" rel="noreferrer">下载最新版</a>`
    : "";
  const specs = item.platform
    ? `<dl class="panel-specs"><div><dt>平台</dt><dd>${escapeHtml(item.platform)}</dd></div></dl>`
    : "";
  const links = item.links
    .map((link) =>
      link.mirror
        ? `<a class="mirror-link" href="${link.href}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`
        : `<a class="square-button" href="${link.href}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`
    )
    .join("");

  panel.setAttribute("aria-labelledby", `tab-${item.id}`);
  panel.innerHTML = `
    <div class="panel-index">
      <span>${item.index}</span>
      <span class="panel-tag">${escapeHtml(item.tag)}</span>
    </div>
    <div class="panel-body">
      <h2 class="panel-title">${escapeHtml(item.title)}</h2>
      <p class="panel-desc">${escapeHtml(item.desc)}</p>
      ${specs}
      <div class="panel-links">${releaseLink}${links}</div>
      ${item.note ? `<p class="panel-note">${escapeHtml(item.note)}</p>` : ""}
    </div>`;

  panel.classList.remove("is-animating");
  void panel.offsetWidth;
  panel.classList.add("is-animating");
}

function selectResource(id, moveFocus = false) {
  if (id === activeId) {
    if (moveFocus) iconRow.querySelector(`#tab-${id}`)?.focus();
    return;
  }

  activeId = id;
  iconRow.querySelectorAll(".icon-button").forEach((button) => {
    const isActive = button.dataset.id === id;
    button.classList.toggle("is-selected", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
    if (isActive && moveFocus) button.focus();
  });
  renderPanel();
}

iconRow.addEventListener("click", (event) => {
  const button = event.target.closest(".icon-button");
  if (button) selectResource(button.dataset.id);
});

iconRow.addEventListener("keydown", (event) => {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!keys.includes(event.key)) return;

  event.preventDefault();
  const current = resources.findIndex((item) => item.id === activeId);
  let next = current;

  if (event.key === "ArrowLeft") next = (current - 1 + resources.length) % resources.length;
  if (event.key === "ArrowRight") next = (current + 1) % resources.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = resources.length - 1;

  selectResource(resources[next].id, true);
});

const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector("#main-nav");

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

renderRow();
renderPanel();
