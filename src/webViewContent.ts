import actions from "./actions";

const getWebviewContent = () => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Workday</title>
    <style>
        input:focus + span {
            border-bottom: solid 2px;
            border-bottom-color: var(--vscode-editor-forground);
        }

        form {
            padding-inline-start: 40px;
            margin-bottom: 40px;
        }

        form input {
            background: none;
            border: none;
            color: var(--vscode-editor-forground);
            font-size: 20px;
            padding: 4px;
            width: 300px;
            border-bottom: 2px dotted;
            border-bottom-color: var(--vscode-editor-forground);
        }

        form input:focus {
            outline: none;
            border-bottom-color: var(--vscode-textLink-foreground);
        }

        ul {
            list-style-type: none;
        }
        
        ul li {
            display: flex;
            align-content: center;
            margin-bottom: 10px;
        }

        ul label {
            font-size: 18px;
            margin-right: 10px;
        }

        ul label, ul a {
            cursor: pointer;
        }

        li input {
            margin: 0px;
            margin-right: 20px;
            display: inline-flex;
            height: 0;
        }

        label input:after {
            content: "✔";
            font-size: 20px;
            color: var(--vscode-button-secondaryBackground);
        }

        label.complete input:after {
            color: var(--vscode-textLink-foreground);
        }

        label a {
            font-size: 14px;
            margin-left: 10px;
            text-decoration: none;
            align-self: center;
            opacity: 0;
            transition: 0.5s;
            transition-delay: 0.1s;
        }

        label a:focus {
            outline: 1px dotted;
            outline-color: var(--vscode-textLink-foreground);
            outline-offset: 2px;
        }

        label:hover a, li input:focus ~ a, label a:focus {
            opacity: 1;
        }

        label.complete span {
            text-decoration: line-through;
        }
    </style>
</head>

<body>
    <h1>Today</h1>
    <ul id="today"></ul>
    <form action="javascript:;" onsubmit="addTodo(this)">
        <input id="new-todo" type="text" placeholder="What will you achieve?" aria-label="Add todo. Press enter key to add." />
    </form>
    <h1>Yesterday</h1>
    <ul id="yesterday"></ul>
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
            const todo = document.getElementById("new-todo");
            vscode.postMessage({
                type: "${actions.ADD_TODO}",
                payload: { title: todo.value }
            })
            todo.value = "";
        }

        function createTodoElement({ title, complete, id, date }) {
            const handleClick = (e) => {
                e.preventDefault()
                vscode.postMessage({
                    type: "${actions.TOGGLE_TODO}",
                    payload: { id, date }
                })
            };
            const item = document.createElement("li");
            item.id = id;
            const label = document.createElement("label")
            label.className = complete ? 'complete' : ''
            label.addEventListener("click", handleClick);
            label.innerHTML = \`<span>\${escapeHTML(title, false)}</span>\`;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = complete;
            checkbox.name = escapeHTML(title, true)
            const deleteBtn = document.createElement("a");
            deleteBtn.href="#"
            deleteBtn['aria-label'] = "Delete todo"
            deleteBtn.innerHTML = "Delete";
            deleteBtn.addEventListener('click', () => vscode.postMessage({type: "${actions.DELETE_TODO}", payload: { id, date }}));
            label.prepend(checkbox)
            item.prepend(label);
            label.appendChild(deleteBtn);
            return item;
        }

        const render = state => {
            const todayList = document.getElementById("today");
            const yesterdayList = document.getElementById("yesterday");
            todayList.innerHTML = "";
            yesterdayList.innerHTML = "";
            state[today] && state[today].forEach((todo) => {
                const item = createTodoElement(todo);
                todo.complete 
                    ? todayList.appendChild(item) 
                    : todayList.prepend(item);
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
