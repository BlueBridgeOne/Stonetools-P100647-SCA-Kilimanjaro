
declare function define(moduleNames: string[], modules: (...code: any) => {}): void;
declare namespace log {
    function debug(title: string, description: string): void;
    function error(title: string, description: string): void;
    function audit(title: string, description: string): void;
}
interface iContext {
    request?: iHttpRequest;
    response?: iHttpResponse;
    key?: string;
    value?: string;
    newRecord?: iDataRecord;
    oldRecord?: iDataRecord;
    type?: "create" | "delete" | "edit"|"print"|"view";
    form?: iForm
}
interface iClientContext {
    currentRecord?: iDataRecord;
    mode?:"create"|"copy"|"edit";
    sublistId?:string;
    fieldId?:string;
    lineNum?:number;
    columnNum?:number;
}
interface iNameValue {
    name: string;
    value: any;
}
interface iRecordLoadOptions {
    type: string;
    id: string;
    isDynamic?: boolean;
}
interface iRecordCreateOptions {
    type: string;
    isDynamic?: boolean;
}
interface iCurrentSublistCommit {
    sublistId: string;
    ignoreRecalc?: boolean;
}
interface iId {
    id: string;
}
interface iIndex {
    index: number;
}
interface iName {
    name: string;
    join?: string;
    label?:string;
    sort?:"ASC"|"DESC";
}
interface iPageSize {
    pageSize: number;
}
interface iSublistId {
    sublistId: string;
}
interface iCurrentSublistIdFieldIdText {
    sublistId: string;
    fieldId: string;
    text: string;
    ignoreFieldChange?: boolean;
}
interface iCurrentSublistIdFieldIdValue {
    sublistId: string;
    fieldId: string;
    value: any;
    ignoreFieldChange?: boolean;
}
interface iSublistIdFieldId {
    sublistId: string;
    fieldId: string;
}
interface iSublistIdFieldIdColumn {
    sublistId: string;
    fieldId: string;
    column: number;
}
interface iSublistIdFieldIdLine {
    sublistId: string;
    fieldId: string;
    line: number;
}
interface iSublistIdLine {
    sublistId: string;
    line: number;
}
interface iSublistIdFieldIdLineValue {
    sublistId: string;
    fieldId: string;
    line: number;
    value: any;
}
interface iFieldIdValue {

    fieldId: string;
    value: any;
}
interface iFieldTextValue {

    fieldId: string;
    value: string;
}
interface iSublistIdLineRecalc {
    sublistId: string;
    line: number;
    ignoreRecalc: boolean;
}
interface iOutput {
    output: string;
}
interface iStringAny {
    [key: string]: string;
}
interface iRedirectOptions {
    type: 'SUITELET';
    identifier: string;
    id: string;
    parameters: any;
}
interface iFileOptions {

    file: iFileObject;
    isInline: boolean;

}
interface iHttpResponse {
    setHeader: (nameValue: iNameValue) => void;
    write: (output: iOutput) => void;
    writePage: (form: iForm) => void;
    sendRedirect: (redirect: iRedirectOptions) => void;
    writeFile: (file: iFileOptions) => void;
}
interface iHttpRequest {
    url: string;
    parameters: iStringAny;
    body: string;
    method: "GET" | "POST" | "DELETE" | "UPDATE";
}
interface iForm {
    addField: (options: iFieldOptions) => iField;
    addSubmitButton: (options: iSubmitButtonOptions) => iButton;
    addTab: (options: iTabOptions) => void;
    addSubtab: (options: iSubtabOptions) => void;
    addButton: (options: iButtonOptions) => iButton;
}
interface iFormOptions {
    title: string;
}
interface iServerWidget {
    createForm: (options: iFormOptions) => iForm;
}

interface iRuntime {
    getCurrentScript: () => iScript;
    executionContext: string;
    envType: string;
}
interface iFileObject {
    url: string;
    name: string;
    folder: string | number;
    isOnline: boolean;
    save: () => number;
    getContents: () => string;
}
interface iFileCreateOptions {
    name: string;
    fileType: "APPCACHE" | "AUTOCAD" | "BMPIMAGE" | "CERTIFICATE" | "CONFIG" | "CSV" | "EXCEL" | "FLASH" | "FREEMARKER" | "GIFIMAGE" | "GZIP" | "HTMLDOC" | "ICON" | "JAVASCRIPT" | "JPGIMAGE" | "JSON" | "MESSAGERFC" | "MP3" | "MPEGMOVIE" | "MSPROJECT" | "PDF" | "PJPGIMAGE" | "PLAINTEXT" | "PNGIMAGE" | "POSTSCRIPT" | "POWERPOINT" | "QUICKTIME" | "RTF" | "SCSS" | "SMS" | "STYLESHEET" | "SVG" | "TAR" | "TIFFIMAGE" | "VISIO" | "WEBAPPPAGE" | "WEBAPPSCRIPT" | "WORD" | "XMLDOC" | "XSD" | "ZIP";
    contents: string;
    description?: string;
    encoding: "UTF-8";
    folder?: number;
    isOnline?: boolean;
}
interface iFileCopyOptions{
    id:string|number;
    folder:string|number;
    conflictResolution?:"FAIL"|"OVERWRITE"|"RENAME_TO_UNIQUE";
}
interface iFile {
    load: (id: iId) => iFileObject;
    create: (options: iFileCreateOptions) => iFileObject;
    copy: (options: iFileCopyOptions) => iFileObject;
    delete: (id: iId) => number;

}
interface iRenderXMLOptions {
    xmlString: string;
}
interface iRenderDataOptions {
    format: "OBJECT"|"XML_DOC"|"XML_STRING"|"JSON";
    alias: string;
    data: any;
}
interface iRenderRecordOptions{
    templateName:string;
    record:iDataRecord;
}
interface iScriptId{
    scriptId:string;
}
interface iTemplateRenderer{
    setTemplateByScriptId:(options:iScriptId)=>void;
    renderAsString:()=>string;
    addCustomDataSource:(options:iRenderDataOptions)=>void;
    addRecord:(option:iRenderRecordOptions)=>void;
    templateContent:string;
}
interface iRender {
    create:()=> iTemplateRenderer;
    xmlToPdf: (options: iRenderXMLOptions) => iFileObject;

}
interface iSubmitButtonOptions {
    label: string;
}
interface iButtonOptions {
    id: string;
    label: string;
    functionName?: string;
}
interface iTabOptions {
    id: string;
    label: string;
}
interface iSubtabOptions {
    id: string;
    label: string;
    tab: string;
}
interface iFieldOptions {
    id: string;
    label: string;
    type: "TEXT" | "CHECKBOX" | "CURRENCY" | "DATE" | "DATETIME" | "DATETIMETZ" | "EMAIL" | "FILE" | "FLOAT" | "HELP" | "INLINEHTML" | "INTEGER" | "IMAGE" | "LABEL" | "LONGTEXT" | "MULTISELECT" | "PASSWORD" | "PERCENT" | "PHONE" | "SELECT" | "RADIO" | "RICHTEXT" | "TEXT" | "TEXTAREA" | "TIMEOFDAY" | "URL";
    source?: string;
    container?: string;

}
interface iButton {

}
interface iTab {

}
interface iField {
    isMandatory: boolean;
    defaultValue: any;
}
interface iSublist {

}
interface iMatrixHeaderField {
    id: string;
    label: string;
    type: string;
}
interface iRecordSaveOptions {
    enableSourcing: boolean;
    ignoreMandatoryFields: boolean;
}

interface iDataRecord {
    id: string;
    type: string;
    getFields: () => string[];
    getSublists: () => string[];
    getValue: (id: string) => any;
    getText: (id: string) => string;
    setValue: (fieldIdValue: iFieldIdValue) => void;
    setText: (fieldIdValue: iFieldTextValue) => void;
    getSublistFields: (sublistId: iSublistId) => string[];
    getMatrixHeaderCount: (sublistIdFieldId: iSublistIdFieldId) => number;
    getMatrixHeaderField: (sublistIdFieldIdColumn: iSublistIdFieldIdColumn) => iMatrixHeaderField;
    getMatrixHeaderValue: (sublistIdFieldIdColumn: iSublistIdFieldIdColumn) => any;
    getLineCount: (sublistId: iSublistId) => number;
    getSublistValue: (sublistIdFieldIdLine: iSublistIdFieldIdLine) => any;
    getSublistText: (sublistIdFieldIdLine: iSublistIdFieldIdLine) => string;
    removeLine: (sublistIdLineRecalc: iSublistIdLineRecalc) => void;
    getSublistSubrecord: (sublistIdFieldIdLine: iSublistIdFieldIdLine) => iDataRecord;
    setSublistValue: (sublistIdFieldIdLineValue: iSublistIdFieldIdLineValue) => void;
    save: (saveOptions: iRecordSaveOptions) => string;
    selectNewLine: (sublistId: iSublistId) => iDataRecord;
    selectLine: (sublistIdLine: iSublistIdLine) => iDataRecord;
    setCurrentSublistText: (text: iCurrentSublistIdFieldIdText) => iDataRecord;
    setCurrentSublistValue: (value: iCurrentSublistIdFieldIdValue) => iDataRecord;
    getCurrentSublistText: (text: iSublistIdFieldId) => string;
    getCurrentSublistValue: (value: iSublistIdFieldId) => any;
    commitLine: (options: iCurrentSublistCommit) => iDataRecord;

}
interface iSubmitOptions {
    type: string;
    id: string | number;
    values: any;
    options: any;
}
interface iRecord {
    load: (typeId: iRecordLoadOptions) => iDataRecord;
    create: (typeId: iRecordCreateOptions) => iDataRecord;
    submitFields: (options: iSubmitOptions) => void;
    delete: (options: iDeleteOptions) => void;
}
interface iColumn {

}
interface iSearchResult {
    id: string;
    getValue: (id: string) => any;
    getText: (id: string) => string;
    values: any;
}
type SearchResultFunction = (res: iSearchResult) => {};
interface iResultSet {
    each: (func: SearchResultFunction) => void;
}
interface iPageData {
    forEach: (func: SearchResultFunction) => void;
}
interface iPage {
    data: iPageData;
}
interface iPagedData {
    count: number;
    fetch: (index: iIndex) => iPage;

}
interface iRecordSearch {
    run: () => iResultSet;
    runPaged: (pageSize: iPageSize) => iPagedData;
}
interface iDeleteOptions {
    type: string;
    id: number | string;
}

interface iLookupOptions {
    type: string;
    id: number | string;
    columns: string[];
}
interface iLoadSearchOptions {
    id: number | string;
}
interface iSearch {
    create: (options: iSearchOptions) => iRecordSearch
    createColumn: (name: iName) => iColumn;
    lookupFields: (options: iLookupOptions) => any;
    load: (options: iLoadSearchOptions) => iRecordSearch;
    Type:any;
}

type iFilter = any[] | "AND" | "OR";

interface iSearchOptions {
    type: string,
    filters: iFilter[],
    columns: iColumn[]
}
interface iFormatOptions{
    value:any;
    type:any;
}
interface iFormat {
    format(options:iFormatOptions);
    Type:any;
}

type HostTypes = "application";

interface iHostType {
    hostType: HostTypes;
}
interface iScriptType {
    deploymentId: string;
    scriptId: string;
    params?: any;
    returnExternalUrl?: boolean;
}
interface iUrl {
    resolveDomain: (hostType: iHostType) => string;
    resolveScript: (scriptType: iScriptType) => string;
}
interface iScript {
    id: string;
    getParameter: (name: iName) => any;
    deploymentId: string;
}
interface iIterator {
    iterator: any;
}
interface iSummaryList {
    errors: iIterator;
    keys: iIterator;
}
interface iSummaryInput {
    error: any;
}
interface iSummary {
    seconds: number;
    usage: number;
    yields: number;
    inputSummary: iSummaryInput;
    mapSummary: iSummaryList;
    reduceSummary: iSummaryList;
}
interface iKeyValue {
    key: string;
    value: any;
}
interface iMapContext {
    key: string;
    value: any;
    write: (keyValue: iKeyValue) => void;
}
interface iReduceContext {
    key: string;
    values: any[];
}
interface iEmail {
    send: (options: any) => void;
}

interface iHttps {
    body?:any;
    url:string;
    credentials?:string[];
    headers?:any;
}