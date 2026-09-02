const STORAGE_KEY = "strangelog_posts";
const CHAR_LIMIT = 280;

const PROMPTS = [
  "an appliance that has started giving you advice",
  "the guy at the DMV who is secretly a king",
  "a conspiracy theory about pigeons that you half believe",
  "your thoughts on soup as a concept",
  "a business idea that would get you arrested",
  "the raccoon that has been elected to local office",
  "an argument you're having with your own reflection",
  "why the moon owes you money",
  "a review of a restaurant that does not exist",
  "the horse you almost bought instead of a car",
  "a letter of resignation from being a person",
  "the vending machine that knows your secrets",
  "a fake historical event you're now certain happened",
  "your beef with a specific cloud",
  "the committee that governs which day it feels like",
];

const composeInput = document.getElementById("composeInput");
const charCount = document.getElementById("charCount");
const postBtn = document.getElementById("postBtn");
const promptBtn = document.getElementById("promptBtn");
const feed = document.getElementById("feed");
const emptyState = document.getElementById("emptyState");

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function relativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderFeed() {
  const posts = loadPosts().sort((a, b) => b.createdAt - a.createdAt);

  emptyState.hidden = posts.length > 0;
  feed.innerHTML = "";

  for (const post of posts) {
    const el = document.createElement("article");
    el.className = "post";
    el.dataset.id = post.id;

    const text = document.createElement("div");
    text.className = "post-text";
    text.textContent = post.text;

    const footer = document.createElement("div");
    footer.className = "post-footer";

    const time = document.createElement("span");
    time.className = "post-time";
    time.dataset.timestamp = post.createdAt;
    time.textContent = relativeTime(post.createdAt);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click", () => deletePost(post.id));

    footer.appendChild(time);
    footer.appendChild(deleteBtn);
    el.appendChild(text);
    el.appendChild(footer);
    feed.appendChild(el);
  }
}

function deletePost(id) {
  const posts = loadPosts().filter((p) => p.id !== id);
  savePosts(posts);
  renderFeed();
}

function updateComposerState() {
  const length = composeInput.value.length;
  charCount.textContent = `${length}/${CHAR_LIMIT}`;
  charCount.classList.toggle("over", length > CHAR_LIMIT);
  postBtn.disabled = length === 0 || length > CHAR_LIMIT || composeInput.value.trim().length === 0;
}

function submitPost() {
  const text = composeInput.value.trim();
  if (!text || text.length > CHAR_LIMIT) return;

  const posts = loadPosts();
  posts.push({
    id: crypto.randomUUID(),
    text,
    createdAt: Date.now(),
  });
  savePosts(posts);

  composeInput.value = "";
  updateComposerState();
  renderFeed();
}

function insertPrompt() {
  if (composeInput.value.trim().length > 0) return;
  const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  composeInput.value = prompt;
  updateComposerState();
  composeInput.focus();
}

function tickTimestamps() {
  document.querySelectorAll(".post-time").forEach((el) => {
    el.textContent = relativeTime(Number(el.dataset.timestamp));
  });
}

composeInput.addEventListener("input", updateComposerState);
postBtn.addEventListener("click", submitPost);
promptBtn.addEventListener("click", insertPrompt);

updateComposerState();
renderFeed();
setInterval(tickTimestamps, 30000);
