# LLM File Dropper

**LLM File Dropper** is a browser-based utility designed to streamline the process of feeding local codebases into Large Language Models (LLMs). It leverages the **File System Access API** to read local directories securely without ever uploading your data to a server.

## Why I made this

When using LLMs I found that they struggle to retain context of what you are working on and how your project is structured. After constantly copying and pasting files along with their paths into LLMs I decided to simplify the effort and build **LLM File Dropper**. After selecting your base folder, select the files you want to feed into an LLM, when you generate the text it will create a text wall that separates each file by their relative path which will give more context for the LLM so it has a better gauge of your file structure.

## 🚀 Live Demo

Check out the live application here:  
👉 **[https://kfig21.github.io/llm-file-dropper/](https://kfig21.github.io/llm-file-dropper/)**

---

## Features

- **Zero Uploads:** Your code stays on your machine. All processing happens locally in the browser.
- **Intelligent File Tree:** A VS Code-inspired explorer with support for recursive directory selection.
- **Real-time Line Counts:** Precise line count tracking for individual files and entire folders, accounting for formatting overhead.
- **Context Optimization:**
  - **Token Estimation:** Get a rough idea of your prompt size before copying.
  - **Minification:** One-click option to strip whitespace and newlines to save on token costs.
  - **Auto-Ignore:** Automatically filters out `node_modules`, `.git`, and `dist` to keep your context clean.
- **ASCII Structure:** Generate a clean ASCII tree representation of your project to help LLMs understand your architecture.
- **Modern UI:** Adaptive Dark/Light mode with language-specific file icons.

---

## Tech Stack

- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Sass (SCSS)
- **API:** Web File System Access API
- **Icons:** React Icons (Simple Icons & VS Code Icons), MUI Icons

---

## How To Use

1.  **Open Folder:** Click the **📂 Choose a folder** button to grant the browser temporary read access to your project.
2.  **Select Files:** Check the boxes for the files/folders you want to include. The folder label will show the total
