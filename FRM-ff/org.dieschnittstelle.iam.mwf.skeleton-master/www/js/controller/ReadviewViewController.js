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
    // TODO: do databinding, set listeners, initialise the view
    // mediaItem (Argumente) an die Readview übergeben / Zugriff gewährleisten
    this.mediaItem = this.args.item;

    // Zugriff per this.root auf die viewController gesteuerte Ansicht/HTML - Bedienelemente etc auslesen
    // Befüllung des Templates durch Aufruf von bindElement() auf  View Controller veranlassen
    // Rückgabewert von bindElement() enthält viewproxy obj für folgende zugriffe/aktualisieren
    this.viewProxy = this.bindElement(
      "mediaReadviewTemplate",
      {
        item: this.mediaItem,
      },
      this.root
    ).viewProxy;

    // bindAction() auf viewProxy obj on-click handler
    this.viewProxy.bindAction("deleteItem", () => {
      this.mediaItem.delete().then(() => {
        //Übergang in die Vorgängeransicht
        this.previousView({ deletedItem: this.mediaItem });
      });
    });

    this.viewProxy.bindAction("mediaEditview", () => {
      this.nextView("mediaEditview", { item: this.mediaItem });
    });

    // call the superclass once creation is done
    super.oncreate();
  }

  // ergänze onback() aus mwf.js und übergebe den returnvValue updatedItem zur korrekten Ausführung von onReturnFromNextView in die Listview
  onback() {
    if (this.updatedItem) this.previousView({ updatedItem: this.updatedItem });
    //in jedem anderen Fall rufe onback() in mwf.js auf
    else super.onback();
  }

  /*
   * for views that initiate transitions to other views
   * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
   */
  async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly

    // Rückkehr aus mediaEditview (wenn edit über Readview geöffnet wurde) nach delete item
    if (
      nextviewid == "mediaEditview" &&
      returnValue &&
      returnValue.deletedItem
    ) {
      // this.deletedItem = returnValue.deletedItem;
      // Übergabe returnValue deletedItem zum handling von onReturnFromNextView in der listview
      this.previousView({ deletedItem: returnValue.deletedItem });
      return false;
    }

    // Rückkehr aus mediaEditview (wenn edit über Readview geöffnet wurde) nach edit item
    // Rückkehr aus mediaEditview mittels onback/backwardsButton nach update item ohne Änderung in editview
    if (returnValue.updatedItem) {
      // zuweisung returnValue updatedItem zum handling von onReturnFromNextView in der listview nach update item
      this.updatedItem = returnValue.updatedItem;
      // update readview nach edit/update item
      this.viewProxy.update({ item: returnValue.updatedItem });
    }
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
