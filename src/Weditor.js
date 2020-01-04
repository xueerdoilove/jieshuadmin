var Weditor = function  (el) {
    var self=this;
    self.target = document.getElementById(el)
    if (self.target.nodeName!='IFRAME') {console.error('编辑器 必须为iframe标签');return;}
    self.editor=self.target.contentWindow;
    self.editor.document.designMode = 'On';
    self.editor.document.body.contentEditable = true;
    self.editor.document.body.innerHTML = '<p>请在这里输入正文...<p>';
    // self.editor.document.head.innerHTML = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><style type="text/css">html{height: 100%;};body{height: 100%;overflow-y: auto;overflow-x:hidden;padding: 10px;};body::-webkit-scrollbar{width:5px;};body::-webkit-scrollbar-track{background-color:#fff;};body::-webkit-scrollbar-thumb{background-color:#00aff0;};body::-webkit-scrollbar-thumb:hover {background-color:#9c3};body::-webkit-scrollbar-thumb:active {background-color:#222};</style>'
    self.editor.document.onpaste=function  (e) {}
    $(self.editor.document.body).bind('DOMNodeInserted', function(e) { 
        if (self.bianji) {
            self.bianji=false
            $(e.delegateTarget).find('img').each(function  () {
                $(this).attr('style','max-width:100%')
                if($(this).attr('src').search('file:')!=-1){
                    $($(this).attr('src','aaa'))
                }
                if(this.parentNode.nodeName!='P'){
                    $(this).wrap("</p><p>")
                }
            })
            $(e.delegateTarget).find('p').each(function  () {
                $(this).removeAttr('style').removeAttr('class').removeAttr('align')
            })
            $(e.delegateTarget).find('a').each(function  () {
                $(this).removeAttr('href').removeAttr('style')
            })
            $(e.delegateTarget).find('span').each(function  () {
                var a = $(this).attr('style')
                if ($(this).html()==''||$(this).html()=='&nbsp;') {$(this).remove()};
                if (a&&a.length>50) {$(this).removeAttr('style')};
            })
            if (e.delegateTarget.childNodes.length>0) {
                for(var i=0;i<e.delegateTarget.childNodes.length;i++){
                    if (e.delegateTarget.childNodes[i].nodeName!='P') {
                        if (e.delegateTarget.childNodes[i].nodeName=='DIV') {
                            var a = e.delegateTarget.childNodes[i].innerHTML;$(e.delegateTarget.childNodes[i]).replaceWith('<p>'+a+'</p>')
                        }else{
                            $(e.delegateTarget.childNodes[i]).wrap("<p></p>")
                        }
                    };
                    if (e.delegateTarget.childNodes[i].nodeName=='P'&&e.delegateTarget.childNodes[i].childNodes.length==0) {
                        $(e.delegateTarget.childNodes[i]).remove()
                    };
                }
            }
            self.bianji = true;
            self.focus()
        }
    });
}
Weditor.prototype={
    bianji:true,
    focus(){
        this.editor.document.body.focus()
    },
    fontSize(size){
        this.editor.document.execCommand("styleWithCSS", false, true);
        this.editor.document.execCommand("FontSize", false, size);
    },
    bColor(color){
        this.editor.document.execCommand('BackColor',false,color) 
    },
    bold() {
        this.editor.document.execCommand("Bold", false, null);
    },
    heading(){// 添加h2 标签
        this.editor.document.execCommand('formatBlock', false, '<h2>');
    },
    fColor(color) {
        this.editor.document.execCommand("ForeColor", false, color);
    },
    image(src) {
        this.editor.document.execCommand("InsertImage", false, src);
    },
    center() {
        this.editor.document.execCommand("JustifyCenter", false, null);
    },
    left() {
        this.editor.document.execCommand("JustifyLeft", false, null);
    },
    right() {
        this.editor.document.execCommand("JustifyRight", false, null);
    },
    Italic() {
        this.editor.document.execCommand("Italic", false, null);
    },
    clearStyle() {
        this.editor.document.execCommand("RemoveFormat", false, null);
    },
    html(html) {
        if (html) {this.editor.document.body.innerHTML = html}else {return this.editor.document.body.innerHTML}
    },
    copyed(){
        var oInput = document.createElement('input');
        oInput.value = this.html()
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy");
        document.body.removeChild(oInput);
    },
    underline() {
        this.editor.document.execCommand("Underline", false, null);
    },
    undo() {
        this.editor.document.execCommand("undo", false, null);
    },
    redo() {
        this.editor.document.execCommand("redo", false, null);
    },
    CreateLink(url) {
        this.editor.document.execCommand("CreateLink", false, url);
    },
    InsertHorizontalRule() {
        this.editor.document.execCommand("InsertHorizontalRule", false, '');
    },
    InsertInputFileUpload() {
        this.editor.document.execCommand("InsertInputFileUpload", false, '');
    },
}

export default Weditor