/**
 * @author Jörn Kreutel
 * @modifiziert von Alexander Thofern mittels Übungsdokument.pdf & tutorial.pdf
 */
import { mwf } from "../Main.js";
import { entities } from "../Main.js";

export default class ListviewViewController extends mwf.ViewController {
  // instance attributes set by mwf after instantiation
  args;
  root;

  // TODO-REPEATED: declare custom instance attributes for this controller
  viewProxy;
  items;
  addNewMediaItemElement;
  switchCRUDOperation;

  constructor() {
    super();

    console.log("ListviewViewController()");
  }

  /*
   * for any view: initialise the view
   */
  async oncreate() {
    // TODO: do databinding, set listeners, initialise the view
    this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");

    //handle on click addNewMediaItem in Listview FRM
    this.addNewMediaItemElement.onclick = () => {
      this.nextView("mediaEditview", { item: new entities.MediaItem() });
    };
    // erneutes einlesen der items inklusive des neu Erstellten zur Übergabe an die Editview
    this.readAllItems();

    // switching CRUD Operations
    this.switchCRUDOperation = this.root.querySelector("#switchCRUDOperation");

    this.switchCRUDOperation.onclick = () => {
      this.switchCRUDOps();
    };
    this.readAllItems();

    // set the currentCRUDScope
    this.root.querySelector("#crudOperationStatus").innerHTML =
      this.application.currentCRUDScope;

    /* old  handle on click addNewMediaItem in Listview MWF/NJM/LDS
    this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
    /* old createNewItem MWF/NJM/LDS
    this.addNewMediaItemElement.onclick = () => {
      this.createNewItem();
    };
    */

    // call the superclass once creation is done
    super.oncreate();
  }

  /* Alte create mediaItem methode bis MWF/NJM+LDS
  createNewItem() {
    // var newItem = new entities.MediaItem("", "https://placekitten.com/100/100");
    // placehold Bild ausgewählt, um die Anforderungen aus MF4 zu prüfen. Das placekitten Bild ist nicht verfügbar
    var newItem = new entities.MediaItem("", "https://placehold.co/100x100");
    this.showDialog("mediaItemDialog", {
      item: newItem,
      actionBindings: {
        submitForm: (event) => {
          event.original.preventDefault();
          newItem.create().then(() => {
            this.addToListview(newItem);
          });
          this.hideDialog();
        },
      },
    });
  }
    */

  // method delete item
  deleteItem(item) {
    item.delete(() => {
      this.removeFromListview(item._id);
    });
  }

  /**
   * method edit exisiting item
   *
   * Unterbinden der Formulardatenübermittlung durch preventDefault()
   * bereits exisiterende Items löschen durch deleteItem
   * actionBindings Template eventhandling on-submit on-click
   * update funktion übergeben um update() auf item aufzurufen
   */

  editItem(item) {
    this.showDialog("mediaItemDialog", {
      item: item,
      actionBindings: {
        submitForm: (event) => {
          event.original.preventDefault();
          item.update().then(() => {
            this.updateInListview(item._id, item);
          });
          this.hideDialog();
        },
        deleteItem: (event) => {
          this.deleteItem(item);
          this.hideDialog();
        },
      },
    });
  }

  /**
   * method to switch CRUD Operation from localDB to remoteDB
   */
  switchCRUDOps() {
    if (this.application.currentCRUDScope == "local") {
      this.application.switchCRUD("remote");
    } else {
      this.application.switchCRUD("local");
    }

    this.root.querySelector("#crudOperationStatus").innerHTML =
      this.application.currentCRUDScope;

    this.readAllItems();
  }

  /**
   * method delete-confirm-dialog
   */
  deleteItemConfirmDialog(item) {
    this.showDialog("mediaItemDeleteDialog", {
      item: item,
      actionBindings: {
        deleteItem: (event) => {
          this.deleteItem(item);
          this.hideDialog();
        },
        cancelDeleteDialog: (event) => {
          this.hideDialog();
        },
      },
    });
  }

  /**
   * method readAllItems - erneutes einlesen der items
   */
  readAllItems() {
    entities.MediaItem.readAll().then((items) => {
      this.initialiseListview(items);
    });
  }

  /**
   * method copyItem in listview
   */
  copyItem(item) {
    const newMediaItem = new entities.MediaItem(
      item.title,
      item.src,
      item.description,
      item.contentType
    );
    newMediaItem.create().then(() => {
      this.readAllItems();
      this.hideDialog();
    });
  }

  /*
   * for views that initiate transitions to other views
   * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
   */
  async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly

    // Rückkehr aus mediaEditview (FRM) nach update item
    if (
      nextviewid == "mediaEditview" &&
      returnValue &&
      returnValue.updatedItem
    ) {
      // item in der listview updaten
      this.updateInListview(returnValue.updatedItem._id);
    }

    // Rückkehr aus mediaEditview nach create item
    if (
      nextviewid == "mediaEditview" &&
      returnValue &&
      returnValue.createdItem
    ) {
      // item zur listview hinzufügen
      this.addToListview(returnValue.createdItem);
    }

    // Rückkehr aus mediaEditview oder mediaReadview nach delete item
    if (
      (nextviewid == "mediaEditview" || "mediaReadview") &&
      returnValue &&
      returnValue.deletedItem
    ) {
      // item aus der listview entfernen
      this.removeFromListview(returnValue.deletedItem._id);
    }

    // Rückkehr aus mediaReadview mittels onback/backwardsButton nach update item
    // Rückkehr aus mediaReadview mittels onback/backwardsButton nach update item ohne Änderung in editview
    if (
      nextviewid == "mediaReadview" &&
      returnValue &&
      returnValue.updatedItem
    ) {
      this.updateInListview(returnValue.updatedItem._id);
    }
  }

  // Rückkehr aus mediaReadview nach delete item
  /*
    if (
      nextviewid == "mediaReadview" &&
      returnValue &&
      returnValue.deletedItem
    ) {
      debugger;
      // item aus der listview entfernen
      this.removeFromListview(returnValue.deletedItem._id);
    }
      */

  /*
   * for views with listviews: bind a list item to an item view
   * TODO: delete if no listview is used or if databinding uses ractive templates
   */

  /*
   * for views with listviews: react to the selection of a listitem
   * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
   */
  onListItemSelected(itemobj, listviewid) {
    // TODO: implement how selection of itemobj shall be handled
    this.nextView("mediaReadview", { item: itemobj });
  }

  /*
   * for views with listviews: react to the selection of a listitem menu option
   * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
   */
  onListItemMenuItemSelected(menuitemview, itemobj, listview) {
    // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    super.onListItemMenuItemSelected(menuitemview, itemobj, listview);
  }

  /*
   * for views with dialogs
   * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
   */
  bindDialog(dialogid, dialogview, dialogdataobj) {
    // call the supertype function
    super.bindDialog(dialogid, dialogview, dialogdataobj);

    // TODO: implement action bindings for dialog, accessing dialog.root
  }
}
