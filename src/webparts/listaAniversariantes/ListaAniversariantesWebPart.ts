import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'ListaAniversariantesWebPartStrings';

import * as $ from "jquery";
import "bootstrap";

require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
//css padrao
require('../../stylelibrary/css/padrao.css');

export interface IListaAniversariantesWebPartProps {
  description: string;
}

export default class ListaAniversariantesWebPart extends BaseClientSideWebPart <IListaAniversariantesWebPartProps> {

  public ListaAniversariantes() {

    const option = {
      month: 'long',
      day: 'numeric'
    };

    $.ajax({
      url: `${this.context.pageContext.web.absoluteUrl}`+
      `/_api/web/lists/getByTitle('Aniversariantes')/items?$select=ID,Title,DataAniversario,Area,UrlFoto`,
      method: 'GET',
      async: false,
      headers: {
        Accept: 'application/json; odata=verbose'
      },
      success: (data) => {
        let html = `<div class="row"><div class="col-md-12">Nenhum aniversariante hoje</div></div>`;

        if (data.d.results.length > 0) {
          html = "";
          $.each(data.d.results, (i, result) => {

            html += `<div class="row">`+
                    `<div class="col">
                      <a href="${result.UrlFoto}" target="_blank" class="imageLink">
                        <img src="${result.UrlFoto}"/>
                      </a>
                    </div>`+
                    `<div class="col">${result.Title}</div>`+
                    `<div class="col">${new Date(result.DataAniversario).toLocaleDateString('pt-br', option)}</div>`+
                    `</div>`;
          });
        }
        $("#divAniversariantes").html(html);
      },
      error: (errorCode, errorMessage) => {
        console.log('Erro ao recuperar os itens. \nError: ' + errorCode + '\nStackTrace: ' + errorMessage);
      }
    });
  }

  public render(): void {
    //carrego o template de layout
    this.domElement.innerHTML = require("./template.html");
    $("#lblTitulo").html(`${escape(this.properties.description)}`);
    this.ListaAniversariantes();
  }

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              })
            ]
          }
        ]
      }
    ]
  };
}
}
