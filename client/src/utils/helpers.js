export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + "s";
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database
    const request = window.indexedDB.open("shop-shop", 1);

    // variables to hold database, transation, object store
    let db, tx, store;

    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keypath: "_id" });
    };

    // handle errors with connection
    request.onerror = function (e) {
      console.log("There was an error");
    };

    // on database open success
    request.onsuccess = function (e) {
      // save a reference of the database to the 'db' variable
      db = request.result;
      // open a transaction whenerever "storeName" is passed into
      tx = db.transaction(storeName, "readwrite");
      // save a reference to that object store
      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.log("error", e);
      };

      switch (method) {
        case "put":
          store.put(object);
          resolve(object);
          break;
        case "get":
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          break;
        default:
          console.log("No valid method");
          break;
      }

      // when transaction is complete, close the connection
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
