import actions from "./actions";

const getWebviewContent = () => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Workday</title>
</head>

<body>
    <h1>Today</h1>
    <ol id="today"></ol>
    <form action="javascript:;" onsubmit="addTodo(this)">
        <input id="new-todo" type="text" placeholder="Fix input bug" aria-label="Add todo. Press enter key to add." />
        <button type="submit">Add</button>
    </form>
    <h2>Yesterday</h2>
    <ol id="yesterday"></ol>
    <script>
        const today = new Date().toLocaleDateString('en-us');
        const yesterday = new Date(new Date() - 86400000).toLocaleDateString('en-us');
        const vscode = acquireVsCodeApi();
        
        const ESC_MAP = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            };

        function escapeHTML(s, forAttribute) {
            return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function (c) {
                return ESC_MAP[c];
            });
        }

        function addTodo(target) {
            const todo = document.getElementById("new-todo").value;
            vscode.postMessage({
                type: "${actions.ADD_TODO}",
                payload: { title: todo }
            })
        }

        function createTodoElement({ title, complete, id, date }) {
            const handleClick = () => {
                vscode.postMessage({
                    type: "${actions.TOGGLE_TODO}",
                    payload: { id, date }
                })
            };
            const item = document.createElement("li");
            item.id = id;
            item.addEventListener("click", handleClick);
            item.innerHTML = escapeHTML(title, false);
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = complete;
            const deleteBtn = document.createElement("a");
            deleteBtn.innerHTML = "Delete";
            deleteBtn.addEventListener('click', () => vscode.postMessage({type: "${actions.DELETE_TODO}", payload: { id, date }}));
            item.appendChild(checkbox);
            item.appendChild(deleteBtn);
            return item;
        }

        const render = state => {
            const todayList = document.getElementById("today");
            const yesterdayList = document.getElementById("yesterday");
            todayList.innerHTML = "";
            yesterdayList.innerHTML = "";
            state[today] && state[today].forEach((todo) => {
                todayList.appendChild(createTodoElement(todo));
            });

            state[yesterday] && state[yesterday].forEach((todo) => {
                yesterdayList.appendChild(createTodoElement(todo));
            });
        };

        window.addEventListener('message', ({data}) => {
            render(data)
        });
        document.getElementById('new-todo').focus()
    </script>
</body>
</html>`;

export default getWebviewContent;
