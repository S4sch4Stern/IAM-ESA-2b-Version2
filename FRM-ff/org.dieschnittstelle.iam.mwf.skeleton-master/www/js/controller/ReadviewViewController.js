/**
 * @author Jörn Kreutel
 * @modifiziert von Alexander Thofern mittels Übungsdokument.pdf & tutorial.pdf
 */
import { mwf } from "../Main.js";
import { entities } from "../Main.js";

export default class ReadviewViewController extends mwf.ViewController {
  // instance attributes set by mwf after instantiation
  args;
  root;
  // TODO-REPEATED: declare custom instance attributes for this controller
  viewProxy;

  constructor() {
    super();

    console.log("ViewControllerTemplate()");
  }

  /*
   * for any view: initialise the view
   */
  async oncreate() {
    debugger;
    // TODO: do databinding, set listeners, initialise the view

    this.mediaItem = this.args.item;

    debugger;
    this.viewProxy = this.bindElement(
      "mediaReadviewTemplate",
      {
        item: this.mediaItem,
      },
      this.root
    ).viewProxy;

    this.viewProxy.bindAction("deleteItem", () => {
      this.mediaItem.delete().then(() => {
        this.previousView({ deletedItem: this.mediaItem });
      });
    });

    this.viewProxy.bindAction("mediaEditview", () => {
      this.nextView("mediaEditview", { item: this.mediaItem });
    });

    // call the superclass once creation is done
    super.oncreate();
  }

  // ergänze onback(); und übergebe den returnvalue updatedItem zur korrekten ausführung von onReturnFromNextView in der Listview
  onback() {
    if (this.updatedItem) this.previousView({ updatedItem: this.updatedItem });
    //in jedem anderen Fall rufe die onback(); in mwf.js auf
    else super.onback();
  }

  /*
   * for views that initiate transitions to other views
   * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
   */
  async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly

    if (
      nextviewid == "mediaEditview" &&
      returnValue &&
      returnValue.deletedItem
    ) {
      debugger;
      this.deletedItem = returnValue.deletedItem;
      this.previousView({ deletedItem: returnValue.deletedItem });
      // return false - Rückkehr in die Listview "mediaOverview"
      return false;
    }

    debugger;
    if (returnValue.updatedItem) {
      this.updatedItem = returnValue.updatedItem;
      this.viewProxy.update({ item: returnValue.updatedItem });
    }

    //this.updatedItem = returnValue.updatedItem;
    // mittels ViewProxy mediaitem updaten

    // ohne diesen Teil erfolgt keine update Sicht in der Readview

    // Übergabe des geupdateten mediaitems an den ReadviewViewController zur korrekten Anzeige nachdem updaten

    // ohne diesen Teil gibt es Fehler weil das MediaItem undefined ist
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
