export const styles = `
        html { height: 100%; }
        body { height: 100%; background: #242428;}
        .swagger-ui {
            min-height: 100vh;
            color: #ffffff;
        }
        
        .swagger-ui .info .title {
            color: rgb(201, 201, 201);
            text-align: center;
        }
        
        .swagger-ui .info p {
            color: #C2C2C2;
            text-align: center;
        }
        
        .swagger-ui .scheme-container {
            background-color: #202023;
        }
        
        .topbar {
            height: 60px;
            display: flex;
            align-items: center;
        }
        
        .topbar-wrapper {
            content: url("data:image/svg+xml;charset=utf-8,<svg width='221' height='38' viewBox='0 0 221 38' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M209.399 28.2479V6.31693H198.787L198.654 10.8269C198.566 12.7429 198.433 14.5558 198.256 16.2655C198.109 17.9751 197.873 19.5374 197.549 20.9523C197.225 22.3377 196.797 23.5168 196.267 24.4896C195.766 25.4623 195.132 26.155 194.365 26.5677L186.716 25.5949C187.777 25.6244 188.647 25.256 189.325 24.4896C190.032 23.7232 190.592 22.6472 191.005 21.2618C191.418 19.8469 191.713 18.1962 191.889 16.3097C192.096 14.4231 192.243 12.3745 192.332 10.1637L192.685 0.480469H216.473V28.2479H209.399ZM185.699 37.8427L185.743 25.5949H220.806V37.8427H214.174V31.4314H192.332V37.8427H185.699Z' fill='white'/><path d='M141.165 31.4314L131.526 16.5307L137.318 13.0377L149.301 31.4314H141.165ZM121.047 31.4314V0.480469H128.166V31.4314H121.047ZM126.087 18.9626V12.9935H136.876V18.9626H126.087ZM137.981 16.7518L131.393 15.9559L141.43 0.480469H148.991L137.981 16.7518Z' fill='white'/><path d='M93.6942 0.480469H100.857V31.4314H93.6942V0.480469ZM79.6336 31.4314H72.4707V0.480469H79.6336V31.4314ZM94.2248 18.7415H79.103V12.684H94.2248V18.7415Z' fill='white'/><path d='M36.1582 31.4314V0.480469H43.2769V20.6428L58.0449 0.480469H64.7657V31.4314H57.6912V11.3133L42.9232 31.4314H36.1582Z' fill='white'/><path d='M0.273438 31.4314V0.480469H28.483V31.4314H21.3643V4.68096L23.0003 6.31693H5.75618L7.39215 4.68096V31.4314H0.273438Z' fill='white'/><path fill-rule='evenodd' clip-rule='evenodd' d='M163.893 9.77075V0H171.102V9.77075L180.114 4.56806L183.718 10.8113L174.707 16.014L183.684 21.197L180.079 27.4402L171.102 22.2572V31.9121H163.893V22.2572L154.916 27.4402L151.311 21.197L160.289 16.014L151.277 10.8113L154.882 4.56806L163.893 9.77075Z' fill='%2333D3D4'/></svg>");
            width: 150px;
            height: auto;
        }
        
        .topbar-wrapper svg {
            visibility: hidden;
        }
        
        .swagger-ui .info .title small.version-stamp {
            display: none;
        }
        
        .swagger-ui .topbar {
            background-color: #202023;
        }
        
        .swagger-ui .opblock-tag {
            color: #FFFFFF;
        }
        
        .swagger-ui .opblock-tag p {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock-summary-control:focus {
            outline: none;
        }
        
        .swagger-ui .opblock .opblock-summary-path {
            color: #ffffff;
        }
        
        .swagger-ui .opblock .opblock-summary-description {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock.opblock-get {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
            background-color: #0090cd;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-get .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-post {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
            background-color: #0caf49;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-post .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-delete {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
            background-color: #d8070b;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-delete .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-patch {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-patch .opblock-summary-method {
            background-color: #683dd9;
            border-color: #737373;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-patch .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-patch .tab-header .tab-item.active h4 span::after {
            background: #737373;
        }
        
        .swagger-ui .opblock.opblock-put {
            background-color: #313134;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-put .opblock-summary-method {
            background-color: #F07953;
            border-color: #1668dc;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .opblock.opblock-put .opblock-summary {
            background-color: #202023;
            border-color: #737373;
        }
        
        .swagger-ui .opblock.opblock-put .tab-header .tab-item.active h4 span::after {
            background: #F07953;
        }
        
        .swagger-ui .btn.authorize {
            background-color: #1668dc;
            border-color: #1668dc;
            color: #FFFFFF;
            border-radius: 6px;
        }
        
        .swagger-ui .btn.authorize svg {
            fill: #FFFFFF;
        }
        
        .swagger-ui .btn {
            background: none;
            border-color: #C2C2C2;
            color: #C2C2C2;
            border-radius: 6px;
        }
        
        .swagger-ui .btn svg {
            fill: #FFFFFF;
        }
        
        .swagger-ui .authorization__btn svg {
            fill: #C2C2C2;
        }
        
        .swagger-ui section.models {
            border: 1px solid #737373;
            border-radius: 6px;
        }
        
        .swagger-ui section.models h4 span {
            color: #FFFFFF;
        }
        
        .swagger-ui .opblock .opblock-section-header h4 {
            color: #FFFFFF;
        }
        
        .swagger-ui .response-col_status {
            color: #FFFFFF;
        }
        
        .swagger-ui table thead tr td {
            color: #FFFFFF;
        }
        
        .swagger-ui table thead tr th {
            color: #FFFFFF;
        }
        
        .swagger-ui .expand-operation, .swagger-ui .opblock-control-arrow {
            fill: #FFFFFF;
        }
        
        .swagger-ui .opblock-description-wrapper p {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock .opblock-section-header {
            border-color: #737373;
            background-color: #4F4F53;
        }
        
        .swagger-ui .tab li button.tablinks {
            color: #FFFFFF;
        }
        
        .swagger-ui .response-col_links {
            color: #C2C2C2;
        }
        
        .swagger-ui .parameter__name {
            color: #FFFFFF;
        }
        
        .swagger-ui .parameter__type {
            color: #FFFFFF;
        }
        
        .swagger-ui .parameter__in {
            color: #C2C2C2;
        }
        
        .swagger-ui .model-title {
            color: #FFFFFF;
        }
        
        .swagger-ui .model {
            color: #FFFFFF;
        }
        
        .swagger-ui .prop-type {
            color: #F7A6DB;
        }
        
        .swagger-ui .model .property.primitive {
            color: #C2C2C2;
        }
        
        .swagger-ui .opblock-body pre.microlight {
            background: #202023 !important;
            border-radius: 6px;
        }
        
        .swagger-ui .parameter__name.required::after {
            color: #F053A1;
        }
        
        .swagger-ui .parameter__name.required span {
            color: #F053A1;
        }
        
        .swagger-ui .dialog-ux .modal-ux {
            background-color: rgb(36, 36, 36);
            box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px;
            border: 0 solid transparent;
        }
        .swagger-ui .dialog-ux .modal-ux-header {
            border-bottom: 1px solid #696969;
        }
        
        .swagger-ui .dialog-ux .modal-ux-header h3 {
            color: rgb(201, 201, 201);
        }
        
        .swagger-ui .dialog-ux .modal-ux-content h4 {
            color: rgb(201, 201, 201);
        }
        
        .swagger-ui .auth-btn-wrapper {
            gap: 20px;
        }
        
        .swagger-ui input[type="text"]::placeholder {
            color: var(--input-placeholder-color);
            opacity: 1;
        }
        
        .swagger-ui input[type="text"] {
            background: rgb(46, 46, 46);
            color: rgb(201, 201, 201);
            border: 0.5px solid var(--mantine-color-dark-4);
            border-radius: 0.5rem;
        }
        
        .swagger-ui input[type="text"]:focus:focus-within,
        .swagger-ui input[type="text"]:focus {
            outline: none;
            --input-bd: var(--input-bd-focus);
            border: 0.5px solid #1971c2;
        }
        
        .swagger-ui .dialog-ux .modal-ux-header .close-modal {
            fill: #b8b8b8
        }
        
        .swagger-ui label {
            color: rgb(201, 201, 201);
        }
        
        .swagger-ui .model-toggle::after {
            background: url("data:image/svg+xml;charset=utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><path fill=\"#b8b8b8\" d=\"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/></svg>") 50% no-repeat;
        }
        
        .swagger-ui select {
            background: rgb(46, 46, 46);
            color: rgb(201, 201, 201);
            border: 0.5px solid var(--mantine-color-dark-4);
            border-radius: 0.5rem;
        }
  `;
