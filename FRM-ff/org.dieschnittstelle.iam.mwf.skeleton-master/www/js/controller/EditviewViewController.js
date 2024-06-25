/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";



/**
 * to do
 * 1erzeugen und modifizieren von mediaiten mittels submit input = speicher button kopfzeile
                Um ein submit-Element außerhalb des Formulars zu platzieren, zu dem es gehört,
            können Sie darauf ein form Attribut setzen, dessen Wert die id des Formulars ist.
        2Löschen button - kopfzeile
    
        3 Elemente src, title und description von MediaItem
        4 falls noch keine item exisitert soll create aufgerufen werden - vorgängeransicht aktualisieren
            Um ein submit-Element außerhalb des Formulars zu platzieren, zu dem es gehört,
            können Sie darauf ein form Attribut setzen, dessen Wert die id des Formulars ist.
        5 wenn keine mediaitem exisisert soll lösch button nicht bedienbar sein
        6 wenn item existiert sollen die werte abgerufen und in die Formular-Felder eingetragen werden
        7 Vorschaubild aus src auslesen - auch beim erzeugen von item - kein ractive data binding experssion
        manuel dem viewcontroller zuweisen
            Hierfür können Sie z.B. einen Event Listener für das blur Event auf dem Eingabefeld
                für das src Attribut setzen.

        8 wenn item existiert bei betätigung des speicher btuittons update ausgeführt werden - zurück zu vorgängeransicht readview
            Um ein submit-Element außerhalb des Formulars zu platzieren, zu dem es gehört,
            können Sie darauf ein form Attribut setzen, dessen Wert die id des Formulars ist.
        9 wenn item existiert bei betätigung des delete btuittons delete ausgeführt werden - zurück zu vorgängeransicht listview
        10 kopzeile " neues medium" wenn neu oder wenn exisitiert dann title vom objekt angezeigt werden
        11 fußzeile back button - listview
        b drei Eingabeelemente jeweils als Kindelement eines <fieldset>
        c die Feldnamen darin als <legend> angeben.
        d <fieldset> markieren Sie dann mit der Klasse mwf-material.
        e Beschreibung’ als textarea

        12 paste url button - Default-Wert nur für neue mediaitems aktiv sein - bei betätigen soll das vorschaubild aktualisiert werden
            Zur Darstellung des Bedienelements könnten Sie z.B. die Bildklasse mwf-img-paste
                verwenden. Um das Eingabeelement für die URL nach Befüllung als ‘befüllt’ anzuzeigen, können
                Sie bei Nutzung von mwf-material das entsprechende <fieldset> mit den Klassen mwf-material-filled
                und mwf-material-valid markieren. Letztere Darstellungsmöglichkeit ist jedoch nicht abnahmerelevant.

        13  aktionsmenü in listview ... Punkte button - mwf editieren erhalten - hinzufügen soll der editierdialog dargestellt werden
            Dafür können Sie auf dem Element für die neue Aktion anstelle des Attributs
            data-mwf-targetaction das Attribut data-mwf-targetview verwenden und diesem die id der Editieransicht
            zuweisen.
            
        14 aktionsmenü in listview ... Punkte button - clone des ausgewählten mediaitems

 * 
 */

export default class EditviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller
    viewProxy;

    constructor() {
        super();

        console.log("EditviewViewController()");
    }


    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // console.log("viewProxy", this.viewProxy)
        // console.log("this", this)

        // // TODO: do databinding, set listeners, initialise the view
        // this.mediaItem = this.args.item;


        // this.viewProxy = this.bindElement(
        //     "mediaEditView",
        //     {
        //       item: mediaItem,
        //     },
        //     this.root
        //   ).viewProxy;

        // call the superclass once creation is done
        super.oncreate();
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

