export const Modal = {
    createModal(classes, id) {
        var modal;
        if (id === undefined && document.getElementById("modal") !== null) {
            modal = document.getElementById("modal");
            modal.innerHTML = "";
        } else {
            modal = document.createElement("div");
            if (id === undefined) {
                modal.id = "modal";
            } else {
                modal.id = id;
            }
            document.body.appendChild(modal);
        }
        modal.className = "modal";
        if (classes !== undefined) {
            if (typeof classes === "string") {
                classes = [classes];
            }
            modal.classList.add(...classes);
        }
        return modal;
    },
    createButton(title, id) {
        var button = document.createElement("button");
        button.className = "modal-button";
        button.textContent = title;
        if (id !== undefined) {
            button.id = id;
        }
        return button;
    },
    clearModals() {
        var modals = document.getElementsByClassName("modal");
        for (let i = 0; i < modals.length; i++) {
            const element = modals.item(i);
            document.body.removeChild(element);
        }
    },
};
