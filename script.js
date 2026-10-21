
const activity = document.getElementById("activity");
const title = document.getElementById("activity-title");
const content = document.getElementById("activity-content");

// Sample learning materials for CatchUp Classroom
const defaultLessons = [
  {
    id: 1,
    title: "Subject-Verb Agreement",
    subject: "English Grammar",
    description: "Learn how subjects and verbs agree in a sentence.",
    body: `
      <h3>What is Subject-Verb Agreement?</h3>
      <p>Subject-verb agreement means that the verb must agree
      with its subject in number.</p>

      <h3>Rule 1: Singular subjects</h3>
      <p>A singular subject usually takes a singular verb.</p>
      <p><strong>Example:</strong> She reads a book every night.</p>

      <h3>Rule 2: Plural subjects</h3>
      <p>A plural subject usually takes a plural verb.</p>
      <p><strong>Example:</strong> They read books every night.</p>

      <h3>Remember</h3>
      <p>Always identify the subject before choosing the correct verb.</p>
    `
  },
  {
    id: 2,
    title: "Parts of Speech",
    subject: "English Grammar",
    description: "Understand the basic functions of words.",
    body: `
      <h3>What are Parts of Speech?</h3>
      <p>Parts of speech classify words according to how they function
      in a sentence.</p>

      <ul>
        <li><strong>Noun:</strong> names a person, place, thing, or idea.</li>
        <li><strong>Pronoun:</strong> replaces a noun.</li>
        <li><strong>Verb:</strong> expresses an action or state.</li>
        <li><strong>Adjective:</strong> describes a noun or pronoun.</li>
        <li><strong>Adverb:</strong> modifies a verb, adjective, or adverb.</li>
        <li><strong>Preposition:</strong> shows a relationship between words.</li>
        <li><strong>Conjunction:</strong> connects words or ideas.</li>
        <li><strong>Interjection:</strong> expresses a sudden feeling.</li>
      </ul>

      <h3>Example</h3>
      <p><em>The clever student answered quickly.</em></p>
      <p>"Clever" describes the student, while "answered" expresses an action.</p>
    `
  }
];

let lessons;

try {
  const savedLessons = localStorage.getItem("catchupLessons");
  lessons = savedLessons
    ? JSON.parse(savedLessons)
    : defaultLessons;
} catch (error) {
  lessons = defaultLessons;
}

let adminMode = false;

function saveLessons() {
  localStorage.setItem("catchupLessons", JSON.stringify(lessons));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showAdmin() {
  adminMode = true;

  openActivity("Manage Lessons", `
    <p>Add learning materials to your lesson library.</p>

    <form id="lesson-form" onsubmit="addLesson(event)">
      <label for="lesson-title">Lesson title</label><br>
      <input id="lesson-title" required maxlength="100"
        placeholder="e.g. Active and Passive Voice"><br><br>

      <label for="lesson-subject">Subject</label><br>
      <input id="lesson-subject" required maxlength="100"
        placeholder="e.g. English Grammar"><br><br>

      <label for="lesson-description">Short description</label><br>
      <input id="lesson-description" required maxlength="250"
        placeholder="What will students learn?"><br><br>

      <label for="lesson-body">Lesson content</label><br>
      <textarea id="lesson-body" required maxlength="10000"
        rows="7" placeholder="Write the lesson here..."></textarea><br>

      <button class="primary-btn" type="submit">
        Add lesson
      </button>
    </form>

    <hr>
    <h3>Existing lessons</h3>
    <div id="admin-lesson-list"></div>

    <button class="secondary-btn" onclick="showLessons()">
      View student lesson library
    </button>
  `);

  renderAdminLessons();
}

function addLesson(event) {
  event.preventDefault();

  const lessonTitle =
    document.getElementById("lesson-title").value.trim();
  const subject =
    document.getElementById("lesson-subject").value.trim();
  const description =
    document.getElementById("lesson-description").value.trim();
  const body =
    document.getElementById("lesson-body").value.trim();

  if (!lessonTitle || !subject || !description || !body) {
    alert("Please complete all fields.");
    return;
  }

  lessons.push({
    id: Date.now(),
    title: lessonTitle,
    subject: subject,
    description: description,
    body: `<h3>${escapeHtml(lessonTitle)}</h3>
      <p>${escapeHtml(body).replace(/\n/g, "<br>")}</p>`
  });

  try {
    saveLessons();
  } catch (error) {
    lessons.pop();
    alert("Unable to save. Browser storage may be unavailable or full.");
    return;
  }

  showAdmin();
  alert("Lesson added successfully!");
}

function renderAdminLessons() {
  const list = document.getElementById("admin-lesson-list");

  if (!list) return;

  if (lessons.length === 0) {
    list.textContent = "No lessons have been added yet.";
    return;
  }

  list.innerHTML = lessons.map(lesson => `
    <article class="learning-item">
      <h3>${escapeHtml(lesson.title)}</h3>
      <p>${escapeHtml(lesson.subject)}</p>
      <button class="delete-btn"
        onclick="deleteLesson(${lesson.id})">
        Delete lesson
      </button>
    </article>
  `).join("");
}

function deleteLesson(id) {
  const lesson = lessons.find(item => item.id === id);

  if (!lesson) return;

  if (!confirm(`Delete "${lesson.title}"?`)) return;

  const previousLessons = lessons;
  lessons = lessons.filter(item => item.id !== id);

  try {
    saveLessons();
    showAdmin();
  } catch (error) {
    lessons = previousLessons;
    alert("Unable to save this change. Please try again.");
  }
}

const modules = [
  {
    id: 1,
    title: "Subject-Verb Agreement Practice",
    description: "Review the rules and prepare to answer practice questions.",
    body: `
      <h3>Practice Activity</h3>
      <p>Read each sentence and identify the correct verb.</p>
      <ol>
        <li>She (write/writes) in her journal every day.</li>
        <li>The students (is/are) ready for class.</li>
        <li>My brother (play/plays) basketball.</li>
      </ol>
      <p><strong>Tip:</strong> Find the subject first, then choose the verb
      that agrees with it.</p>
    `
  }
];

function openActivity(heading, html) {
  activity.hidden = false;
  title.textContent = heading;
  content.innerHTML = html;
  activity.scrollIntoView({ behavior: "smooth" });
}

function showMessage(section) {
  if (section === "Missed Lessons") {
    showLessons();
  } else if (section === "Learning Modules") {
    showModules();
  }
}

function showLessons() {
  const html = `
    <p>Choose a lesson to review.</p>
    <div class="learning-list">
      ${lessons.map(lesson => `
        <article class="learning-item">
          <h3>${lesson.title}</h3>
          <p><strong>${lesson.subject}</strong></p>
          <p>${lesson.description}</p>
          <button class="primary-btn"
            onclick="openLesson(${lesson.id})">
            Read lesson →
          </button>         
           ${adminMode ? `
            <button class="delete-btn"
              onclick="deleteLesson(${lesson.id})">
              Delete lesson
            </button>
          ` : ""}
        </article>
      `).join("")}
    </div>
  `;

  openActivity("Missed Lessons", html);
}

function openLesson(id) {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) return;

  openActivity(lesson.title, `
    <p><strong>Subject:</strong> ${lesson.subject}</p>
    ${lesson.body}
    <button class="primary-btn" onclick="showLessons()">
      ← Back to lessons
    </button>
  `);
}

function showModules() {
  const html = `
    <p>Choose a learning module to study.</p>
    <div class="learning-list">
      ${modules.map(module => `
        <article class="learning-item">
          <h3>${module.title}</h3>
          <p>${module.description}</p>
          <button class="primary-btn"
            onclick="openModule(${module.id})">
            Open module →
          </button>
        </article>
      `).join("")}
    </div>
  `;

  openActivity("Learning Modules", html);
}

function openModule(id) {
  const module = modules.find(item => item.id === id);
  if (!module) return;

  openActivity(module.title, `
    ${module.body}
    <button class="primary-btn" onclick="showModules()">
      ← Back to modules
    </button>
  `);
}

function closeActivity() {
  activity.hidden = true;
  document.getElementById("lessons").scrollIntoView({
    behavior: "smooth"
  });
}

function startQuiz() {
  openActivity("Quick Knowledge Check", `
    <p><strong>Question 1:</strong> Why is it important
    to review a lesson you missed?</p>

    <label>
      <input type="radio" name="answer" value="a">
      To avoid studying altogether
    </label><br>

    <label>
      <input type="radio" name="answer" value="b">
      To understand the topic and fill learning gaps
    </label><br>

    <label>
      <input type="radio" name="answer" value="c">
      To skip future lessons
    </label><br><br>

    <button class="primary-btn" onclick="checkAnswer()">
      Submit answer
    </button>

    <p id="feedback" aria-live="polite"></p>
  `);
}

function checkAnswer() {
  const answer = document.querySelector(
    'input[name="answer"]:checked'
  );
  const feedback = document.getElementById("feedback");

  if (!answer) {
    feedback.textContent = "Please select an answer first.";
    feedback.style.color = "#b45309";
    return;
  }

  feedback.textContent = answer.value === "b"
    ? "Correct! Reviewing missed lessons helps fill learning gaps."
    : "Not quite. Try again and think about the purpose of reviewing.";

  feedback.style.color = answer.value === "b"
    ? "green"
    : "#b45309";
}
