(function () {
    var sgtApp = angular.module("sgtApp");
    sgtApp.service("pdfService", pdfServiceController);
    function pdfServiceController() {
        var $this = this;
        function ParseContainer(cnt, e, p, styles) {
            var elements = [];
            var children = e.childNodes;
            if (children.length != 0) {
                for (var i = 0; i < children.length; i++)
                    p = ParseElement(elements, children[i], p, styles);
            }
            if (elements.length != 0) {
                for (var i = 0; i < elements.length; i++)
                    cnt.push(elements[i]);
            }
            return p;
        }
        function ComputeStyle(o, styles) {
            for (var i = 0; i < styles.length; i++) {
                var st = styles[i].trim().toLowerCase().split(":");
                if (st.length == 2) {
                    switch (st[0]) {
                        case "font-size": {
                            o.fontSize = parseInt(st[1]);
                            break;
                        }
                        case "text-align": {
                            switch (st[1]) {
                                case "right":
                                    o.alignment = 'right';
                                    break;
                                case "center":
                                    o.alignment = 'center';
                                    break;
                            }
                            break;
                        }
                        case "font-weight": {
                            switch (st[1]) {
                                case "bold":
                                    o.bold = true;
                                    break;
                            }
                            break;
                        }
                        case "text-decoration": {
                            switch (st[1]) {
                                case "underline":
                                    o.decoration = "underline";
                                    break;
                            }
                            break;
                        }
                        case "font-style": {
                            switch (st[1]) {
                                case "italic":
                                    o.italics = true;
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
        }
        function ParseElement(cnt, e, p, styles) {
            if (!styles)
                styles = [];
            if (e.getAttribute) {
                var nodeStyle = e.getAttribute("style");
                if (nodeStyle) {
                    var ns = nodeStyle.split(";");
                    for (var k = 0; k < ns.length; k++)
                        styles.push(ns[k]);
                }
            }
            switch (e.nodeName.toLowerCase()) {
                case "#text": {
                    var t = { text: e.textContent.replace(/\n/g, "") };
                    if (styles)
                        ComputeStyle(t, styles);
                    p.text.push(t);
                    break;
                }
                case "b":
                case "strong": {
                    ParseContainer(cnt, e, p, styles.concat(["font-weight:bold"]));
                    break;
                }
                case "u": {
                    ParseContainer(cnt, e, p, styles.concat(["text-decoration:underline"]));
                    break;
                }
                case "i": {
                    ParseContainer(cnt, e, p, styles.concat(["font-style:italic"]));
                    break;
                }
                case "span": {
                    ParseContainer(cnt, e, p, styles);
                    break;
                }
                case "br": {
                    p = CreateParagraph();
                    cnt.push(p);
                    break;
                }
                case "table":
                    {
                        var t = {
                            table: {
                                widths: [],
                                body: []
                            }
                        };
                        var border = e.getAttribute("border");
                        var isBorder = false;
                        if (border)
                            if (parseInt(border) == 1)
                                isBorder = true;
                        if (!isBorder)
                            t.layout = 'noBorders';
                        ParseContainer(t.table.body, e, p, styles);
                        var widths = e.getAttribute("widths");
                        if (!widths) {
                            if (t.table.body.length != 0) {
                                if (t.table.body[0].length != 0)
                                    for (var k = 0; k < t.table.body[0].length; k++)
                                        t.table.widths.push("*");
                            }
                        }
                        else {
                            var w = widths.split(",");
                            for (var k = 0; k < w.length; k++)
                                t.table.widths.push(w[k]);
                        }
                        cnt.push(t);
                        break;
                    }
                case "tbody": {
                    ParseContainer(cnt, e, p, styles);
                    break;
                }
                case "tr": {
                    var row = [];
                    ParseContainer(row, e, p, styles);
                    cnt.push(row);
                    break;
                }
                case "td": {
                    p = CreateParagraph();
                    var st = { stack: [] };
                    st.stack.push(p);
                    var rspan = e.getAttribute("rowspan");
                    if (rspan)
                        st.rowSpan = parseInt(rspan);
                    var cspan = e.getAttribute("colspan");
                    if (cspan)
                        st.colSpan = parseInt(cspan);
                    ParseContainer(st.stack, e, p, styles);
                    cnt.push(st);
                    break;
                }
                case "div":
                case "p": {
                    p = CreateParagraph();
                    var st = { stack: [] };
                    st.stack.push(p);
                    ComputeStyle(st, styles);
                    ParseContainer(st.stack, e, p);
                    cnt.push(st);
                    break;
                }
                default: {
                    console.log("Parsing for node " + e.nodeName + " not found");
                    break;
                }
            }
            return p;
        }
        function ParseHtml(cnt, htmlText) {
            var html = $(htmlText.replace(/\t/g, "").replace(/\n/g, ""));
            var p = CreateParagraph();
            for (var i = 0; i < html.length; i++)
                ParseElement(cnt, html.get(i), p);
        }
        function CreateParagraph() {
            var p = { text: [] };
            return p;
        }
        $this.CreatePdf = function (data) {
            var content = [];
            ParseHtml(content, data);
            pdfMake.createPdf({ content: content }).download();
        };
        $this.CreateTurnoPdf = function (_body, _header) {
            var widths = [];
            _body[0].forEach(function (e) { return widths.push('auto'); });
            var docDefinition = {
                header: {
                    margin: 10,
                    columns: [{
                            table: {
                                widths: ['100%'],
                                body: [
                                    [
                                        {
                                            text: _header,
                                            height: 80
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                content: [
                    {
                        layout: 'lightHorizontalLines',
                        table: {
                            headerRows: 1,
                            widths: widths,
                            body: _body
                        }
                    }
                ],
                footer: function (currentPage, pageCount) {
                    return {
                        columns: ['',
                            {
                                text: currentPage.toString() + ' de ' + pageCount.toString(),
                                aligment: 'center'
                            },
                            ''
                        ]
                    };
                },
                pageSize: 'A4'
            };
            pdfMake.createPdf(docDefinition).download();
        };
    }
})();
//# sourceMappingURL=PdfService.js.map