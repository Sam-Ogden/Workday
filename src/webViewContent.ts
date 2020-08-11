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
    <h1>Yesterday</h1>
    <ol id="yesterday"></ol>
    <script>
        const today = new Date().toLocaleDateString('en-us');
        const yesterday = new Date(new Date() - 86400000).toLocaleDateString('en-us');
        const vscode = acquireVsCodeApi();
        
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
            item.setAttribute("data-date", date);
            item.addEventListener("click", handleClick);
            item.innerHTML = title;
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = complete;
            item.appendChild(checkbox);
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
