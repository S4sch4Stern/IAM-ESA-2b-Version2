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
  addNewMediaItemElement;
  mediaEditForm;
  mediaItemNoEdit;

  constructor() {
    super();
    //unused
    this.crudops = GenericCRUDImplRemote.newInstance("MediaItem");
    console.log("EditviewViewController()");
  }

  /*
   * for any view: initialise the view
   */
  async oncreate() {
    this.mediaItem = this.args.item;
    this.mediaItemNoEdit = JSON.parse(JSON.stringify(this.mediaItem));

    this.viewProxy = this.bindElement(
      "mediaEditviewTemplate",
      { item: this.mediaItem },
      this.root
    ).viewProxy;

    this.viewProxy.bindAction("pasteDefaultUrl", () => {
      this.pasteDefaultUrl(this.mediaItem);
    });

    this.editMediaForm = this.root.querySelector("#mediaEditForm");
    this.editMediaForm.onsubmit = (event) => {
      event.preventDefault();
      if (this.mediaItem.created) {
        this.updateItem(this.mediaItem);
      } else this.createItem();
    };

    //delete item in editMediaview

    this.viewProxy.bindAction("deleteItem", () => {
      this.mediaItem.delete().then(() => {
        this.previousView({ deletedItem: this.mediaItem });
      });
    });

    //!!!!!!!!!!!!
    //to do load doesnst work right
    //refesh image new mediaItem

    /*
    this.viewProxy.bindAction("refreshPreviewImage", async (event) => {
      debugger;
      this.loadMediaContent(this.mediaItem, "contentType").then((event) => {
        this.pasteDefaultUrl(this.mediaItem);
        this.root.querySelector(".previewImage").src = item.src;
        this.viewProxy.update({ item: this.mediaItem });
      });
    });
    */

    // Disable upload input wenn currentCRUDScope local ist
    const disableInput = this.root.querySelector("#uploadInput");
    // Disable upload input wenn currentCRUDScope local ist
    if (this.application.currentCRUDScope == "local") {
      this.root.querySelector("#uploadButton").classList.add("disabled");
      disableInput.disabled = true;
    }

    // localfile Src/Name auslesen
    const uploadInput = this.root.getElementsByTagName("form")[0];
    console.log(uploadInput);
    const localFileSrc = uploadInput.srcInput;

    // localfile Src/Name per persistMediaContent() mittels XMLHttpRequest an mongoDB senden
    localFileSrc.onchange = () => {
      if (localFileSrc.files.length > 0) {
        const scrfile = localFileSrc.files[0];

        this.crudops
          .persistMediaContent(this.mediaItem, "src", scrfile)
          .then(() => {
            this.getLocalUrl(this.mediaItem, this.mediaItem.src);
          });
      }
    };

    // call the superclass once creation is done
    super.oncreate();
  }

  // erstelle ein neues Item in der Edit/Add View
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

  // update vorhandenes item
  updateItem(item) {
    item.update().then(() => {
      this.previousView({ updatedItem: item });
    });
  }

  // Setzt die nicht gespeicherte Editierung in der Editview zurück, wenn backwardButton genutzt wird
  onback() {
    this.mediaItem.title = this.mediaItemNoEdit.title;
    this.mediaItem.src = this.mediaItemNoEdit.src;
    this.mediaItem.contentType = this.mediaItemNoEdit.contentType;
    this.mediaItem.description = this.mediaItemNoEdit.description;

    this.previousView({ updatedItem: this.mediaItem });
  }

  // setzte defaultURL mittels pasteButton und update item
  pasteDefaultUrl(item) {
    const defaultUrl = "https://placehold.co/400";
    item.src = defaultUrl;
    this.viewProxy.update({ item: item });
    mediaEditForm.defaultUrl.classList.add(
      "mwf-material-filled",
      "mwf-material-valid"
    );
  }

  // füge localfile Src/Name in die src des Items ein und update item

  getLocalUrl(item, URL) {
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
