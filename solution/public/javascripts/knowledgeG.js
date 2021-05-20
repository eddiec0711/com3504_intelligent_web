const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';

/**
 * it inits the widget by selecting the type from the field graphType
 * and it displays the Google Graph widget
 * it also hides the form to get the type
 */
function widgetInit(){
    let type= document.getElementById("graphType").value;
    if (type) {
        let config = {
            'limit': 10,
            'languages': ['en'],
            'types': [type],
            'maxDescChars': 100,
            'selectHandler': selectItem,
        }
        KGSearchWidget(apiKey, document.getElementById("graphInput"), config);
        document.getElementById('graphInput').disabled = false;
        document.getElementById('graphInput').placeholder = '';
    }
    else {
        alert('Set the type please');
        document.getElementById('typeSet').innerHTML= '';
    }
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function selectItem(event){
    let row= event.row;
    addRow(row);
    storeKGData(roomNo, row);
}

function addRow(row) {
    let container = document.createElement('div');
    let panel = document.getElementById('resultPanel');

    let name = document.createElement('h5');
    name.innerHTML = row.name;

    let id = document.createElement('p');
    id.innerHTML = row.id;

    let desc = document.createElement('div');
    desc.innerText = row.rc;

    let linkContainer = document.createElement('div');
    let link = document.createElement('a');
    link.href = row.qc;
    link.text = 'Link to Webpage';
    linkContainer.appendChild(link);

    container.appendChild(name);
    container.appendChild(id);
    container.appendChild(desc);
    container.appendChild(linkContainer);
    container.className = "pb-3 pt-3 border-bottom";

    panel.appendChild(container)
    document.getElementById('knowledgeG').style.display = 'none';
}

/**
 * currently not used. left for reference
 * @param id
 * @param type
 */
function queryMainEntity(id, type){
    const  params = {
        'query': mainEntityName,
        'types': type,
        'limit': 10,
        'indent': true,
        'key' : apiKey,
    };
    $.getJSON(service_url + '?callback=?', params, function(response) {
        $.each(response.itemListElement, function (i, element) {

            $('<div>', {text: element['result']['name']}).appendTo(document.body);
        });
    });
}

function addKnowledgeG() {
    document.getElementById('knowledgeG').style.display = 'block';
}
