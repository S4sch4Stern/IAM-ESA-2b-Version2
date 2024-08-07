/**
 * @author Jörn Kreutel
 * @modifiziert von Alexander Thofern mittels Übungsdokument.pdf & tutorial.pdf
 */
import { mwf } from "../Main.js";
import { entities } from "../Main.js";
import { GenericCRUDImplRemote } from "../Main.js";

export default class EditviewViewController extends mwf.ViewController {
  // instance attributes set by mwf after instantiation
  args;
  root;
  // TODO-REPEATED: declare custom instance attributes for this controller
  viewProxy;
  //addNewMediaItemElement;
  mediaEditForm;
  mediaItemNoEdit;

  constructor() {
    super();
    // neue Instanz generischen CRUD (Create, Read, Update, Delete) Objekts erstellen
    // für die Entität MediaItem
    // rufe über das objekt newInstance() auf
    this.crudRemoteObj = GenericCRUDImplRemote.newInstance("MediaItem");
    console.log("EditviewViewController()");
  }

  /*
   * for any view: initialise the view
   */
  async oncreate() {
    // mediaItem (Argumente) an die EditView übergeben / Zugriff gewährleisten
    this.mediaItem = this.args.item;
    // clone des items erstellen - auslesen des JSON strings und in obj umwandeln
    this.mediaItemNoEdit = JSON.parse(JSON.stringify(this.mediaItem));

    // Zugriff per this.root auf die viewController gesteuerte Ansicht/HTML - Bedienelemente etc auslesen
    // Befüllung des Templates durch Aufruf von bindElement() auf  View Controller veranlassen
    // Rückgabewert von bindElement() enthält viewproxy obj für folgende zugriffe/aktualisieren
    this.viewProxy = this.bindElement(
      "mediaEditviewTemplate",
      { item: this.mediaItem },
      this.root
    ).viewProxy;

    // bindAction() auf viewProxy obj on-click handler
    this.viewProxy.bindAction("pasteDefaultUrl", () => {
      this.pasteDefaultUrl(this.mediaItem);
    });

    // create oder update item handler
    this.editMediaForm = this.root.querySelector("#mediaEditForm");
    this.editMediaForm.onsubmit = (event) => {
      event.preventDefault();
      if (this.mediaItem.created) {
        this.updateItem(this.mediaItem);
      } else this.createItem();
    };

    /**
     * method delete item in editMediaView
     *
     * bindAction() auf viewProxy obj on-click handler
     */
    this.viewProxy.bindAction("deleteItem", () => {
      this.mediaItem.delete().then(() => {
        this.previousView({ deletedItem: this.mediaItem });
      });
    });

    // Zugriff auf Dom Element uploadInput
    const disableInput = this.root.querySelector("#uploadInput");
    // add disable on upload input if currentCRUDScope local
    if (this.application.currentCRUDScope == "local") {
      this.root.querySelector("#uploadButton").classList.add("disabled");
      disableInput.disabled = true;
    }

    // form aus dem DOM auslesen und an getFormInput zuweisen
    const getFormInput = this.root.getElementsByTagName("form")[0];
    // input mit name srcInput zuweisen
    const localFileSrc = getFormInput.srcInput;

    // onchange eventhandler bei Wertänderung des HTML-Elements localFileSrc obj
    localFileSrc.onchange = () => {
      if (localFileSrc.files.length > 0) {
        //file aus fileList auslesen
        const scrfile = localFileSrc.files[0];

        // mediaitem, attr & Fileobj an persistMediaContent() übergeben für XMLHttpRequest
        this.crudRemoteObj
          .persistMediaContent(this.mediaItem, "src", scrfile)
          .then(() => {
            // mediaitem und src an getLocalFileUrl() übergeben - korrekten Link mit Namen der src in html einfügen
            this.getLocalFileUrl(this.mediaItem, this.mediaItem.src);
          });
      }
    };

    // call the superclass once creation is done
    super.oncreate();
  }

  /**
   * method createItem
   * Formulardaten auslesen - neues mediaItem erstellen
   */
  createItem() {
    const formData = new FormData(this.editMediaForm);

    this.mediaItem.src = formData.get("src");
    this.mediaItem.title = formData.get("title");
    this.mediaItem.description = formData.get("description");

    if (this.mediaItem._id) {
      this.mediaItem.create().then(() => {
        console.log("successfully created media item");
        this.previousView({ createdItem: this.mediaItem });
      });
    }
  }

  /**
   * method update existing item
   */
  updateItem(item) {
    item.update().then(() => {
      this.previousView({ updatedItem: item });
    });
  }

  /**
   * method onback for cloned item
   * Setzt die nicht gespeicherte Editierung in der Editview zurück, wenn backwardButton genutzt wird
   */
  onback() {
    this.mediaItem.title = this.mediaItemNoEdit.title;
    this.mediaItem.src = this.mediaItemNoEdit.src;
    this.mediaItem.contentType = this.mediaItemNoEdit.contentType;
    this.mediaItem.description = this.mediaItemNoEdit.description;

    this.previousView({ updatedItem: this.mediaItem });
  }

  /**
   * method pasteDefaultUrl by button
   * setzte defaultURL mittels pasteButton und update item
   */
  pasteDefaultUrl(item) {
    const defaultUrl = "https://placehold.co/400";
    item.src = defaultUrl;
    this.viewProxy.update({ item: item });
    mediaEditForm.defaultUrl.classList.add(
      "mwf-material-filled",
      "mwf-material-valid"
    );
  }

  /**
   * method getLocalFileUrl
   * füge localfile src/Name in die src des items ein und update item
   */
  getLocalFileUrl(item, URL) {
    const fileURL = URL;
    item.src = fileURL;
    this.viewProxy.update({ item: item });
    mediaEditForm.defaultUrl.classList.add(
      "mwf-material-filled",
      "mwf-material-valid"
    );
  }

  /*
   * for views that initiate transitions to other views
   * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
   */
  async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
  }

  /*
   * for views with listviews: bind a list item to an item view
   * TODO: delete if no listview is used or if databinding uses ractive templates
   */
  bindListItemView(listviewid, itemview, itemobj) {
    // TODO: implement how attributes of itemobj shall be displayed in itemview
  }

  /*
   * for views with listviews: react to the selection of a listitem
   * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
   */
  onListItemSelected(itemobj, listviewid) {
    // TODO: implement how selection of itemobj shall be handled
  }

  /*
   * for views with listviews: react to the selection of a listitem menu option
   * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
   */
  onListItemMenuItemSelected(menuitemview, itemobj, listview) {
    // TODO: implement how selection of the option menuitemview for itemobj shall be handled
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
