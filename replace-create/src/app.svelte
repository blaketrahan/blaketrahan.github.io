<script>
  function getFileAsStr(filename) {
    return fetch(filename)
      .then(resp => {
        return resp.text();
      })
      .catch(() => {
        console.error('Failed to load HTML:', filename);
        return '';
      });
  }

  async function fileToNode(filename) {
    const htmlStr = await getFileAsStr(filename);
    return document.createRange().createContextualFragment(htmlStr);
  }

  // Replace
  async function replace(elem, filename) {
    const node = await fileToNode(filename);
    if (!!node === false) { 
      console.error('Failed to REPLACE from file:', filename);
      return;
    }
    if (typeof elem === 'string') {
      const domElem = document.getElementById(elem);
      if (!!domElem) {
        domElem.parentNode.replaceChild(node, domElem);
      } else {
        console.error('Failed to CREATE from file:', filename, 'because target element missing:', elem);
      }
    } else {
      elem.parentNode.replaceChild(node, elem);
    }

    removeInventoryItemsFromPage();
  }

  async function create(elem, parentId, filename) {
    const node = await fileToNode(filename);
    if (!!node === false) { 
      console.error('Failed to CREATE from file:', filename);
      return;
    }
    if (!!parentId) {
      const parent = document.getElementById(parentId);
      if (!!parent) {
        parent.appendChild(node);
      } else {
        console.error('Failed to CREATE from file:', filename, 'because target element missing:', parentId);
      }
    } else {
      document.body.appendChild(node);
    }
    elem.onclick = null;
    elem.classList.add('clicked');

    removeInventoryItemsFromPage();
  }

  function restart() {
    localStorage.removeItem('items');
    location.reload();
  }

  function updateInventory() {
    const items = localStorage.getItem('items');
    if (!!items === false) {
      return;
    }
    const inventory = document.getElementById('InventorySystemID');
    if (!!inventory === false) {
      return;
    }
    const parsed = JSON.parse(items);
    inventory.innerHTML = '';
    for (const prop in parsed) {
      if (Object.prototype.hasOwnProperty.call(parsed, prop)) {
        inventory.innerHTML += `<div>${parsed[prop]}</div>`;
      }
    }
    if (inventory.innerHTML.length) {
      inventory.innerHTML += `<div onclick="restart()">Restart</div>`;
    }
  }

  function pickup(elem) {
    const items = localStorage.getItem('items');
    const key = elem.getAttribute('id');
    let newItems;
    if (!!items) {
      newItems = JSON.parse(items);
      newItems[key] = elem.innerHTML;
    } else {
      newItems = {};
      newItems[key] = elem.innerHTML;
    }
    localStorage.setItem('items', JSON.stringify(newItems));
    elem.parentNode.removeChild(elem);
    updateInventory();
  }

  function removeInventoryItemsFromPage() {
    const items = localStorage.getItem('items');
    if (!!items === false) {
      return;
    }
    const inventory = document.getElementById('InventorySystemID');
    if (!!inventory === false) {
      return;
    }
    const parsed = JSON.parse(items);
    for (const prop in parsed) {
      if (Object.prototype.hasOwnProperty.call(parsed, prop)) {
        const elemOnPage = document.getElementById(prop);
        if (!!elemOnPage) {
          elemOnPage.parentNode.removeChild(elemOnPage);
        }
      }
    }
  }

  window.addEventListener('load', () => {
    const inventory = document.createElement('div');
    inventory.id = 'InventorySystemID';
    document.body.appendChild(inventory);
    updateInventory();
    removeInventoryItemsFromPage();
  });

  function require(key) {
    const items = localStorage.getItem('items');
    if (!!items && !!JSON.parse(items)[key]) {
      return {
        create: (elem, parentId, filename) => {
          create(elem, parentId, filename);
        },
        replace: (elem, filename) => {
          replace(elem, filename);
        }
      };
    } else {
      return {
        create: () => {
          console.log('Missing item:', key);
        },
        replace: () => {
          console.log('Missing item:', key);
        }
      };
    }
  }

  window.restart = restart;
  window.replace = replace;
  window.create = create;
  window.pickup = pickup;
  window.require = require;
</script>