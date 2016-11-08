(function () {
    var Plugin, _init;
    var _animateTime, _eventBind, _addTime, _cancelAddTime, _renderEasySearch, _renderQuickSearch,
        _renderInputPlace, _renderConditionList, _addToConditionList, _removeFromConditionList,
        _refreshConditionNum, _getSelectedConditionFromForm, _renderAdvanceSearchForm, _getSelectedConditionFromModal,
        _getSearchCondition, _findModel, _getConditionFromForm;
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapAdvancedQuery.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
        }

        Plugin.prototype.getValue = function () {
            return _getSearchCondition(this.options);
        };

        return Plugin;
    })();

    _init = function (element, options) {

        var searchModalUrl = options.url;
        var modalData = options.data;
        var easyArray = [];
        var quickArray = [];
        var guid = BH_UTILS.NewGuid();

        _animateTime = function () {
            return 450;
        };

        _eventBind = function ($advanced, $advancedModal) {
            $advanced.on("click", "[bh-advanced-query-role=addTime]", function () {
                _addTime($(this));
            });

            $advanced.on("click", "[bh-advanced-query-role=cancelAddTime]", function () {
                _cancelAddTime($(this));
            });

            // 展开高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedOpen]", function () {
                $($advanced).addClass('bh-active');
                options.searchModel = 'advanced';
            });

            // 关闭高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedClose]", function () {
                $($advanced).removeClass('bh-active');
                options.searchModel = 'easy';
            });

            // 删除搜索条件
            $advanced.on("click", "[bh-advanced-query-role=conditionDismiss]", function () {
                $(this).closest('.bh-advancedQuery-form-row').remove();
            });

            // 弹出  添加搜索条件 弹框
            $advanced.on("click", "[bh-advanced-query-role=addCondition]", function () {
                _renderConditionList(options);
                $("[bh-advanced-query-role=addDialog][data-guid=" + options.guid + "]").jqxWindow('open');
            });

            // 添加完成 添加搜索条件 弹框
            $advancedModal.on("click", "[bh-advanced-query-role=addDialogConfirm]", function () {
                //获取已选字段
                _renderAdvanceSearchForm(options);
                $("[bh-advanced-query-role=addDialog]").jqxWindow('close');
            });

            // 关闭 添加搜索条件弹框
            $advancedModal.on("click", "[bh-advanced-query-role=addDialogCancel]", function () {
                $("[bh-advanced-query-role=addDialog]").jqxWindow('close');
            });

            // 选择添加字段 向右添加按钮
            $advancedModal.on('click', '[bh-advanced-query-role=modalListRightBtn]', function(){
                _addToConditionList();
            });

            // 选择添加字段 向左添加按钮
            $advancedModal.on('click', '[bh-advanced-query-role=modalListLeftBtn]', function(){
                _removeFromConditionList();
            });

            // easy搜索 监听 按键输入
            $advanced.on('keyup', '.bh-advancedQuery-quick-search-wrap input[type=text]', function (e) {
                var easySelectH = $advanced.data('easyarray').length * 28 + 1; // 下拉框高度
                var easySelectW = $(this).outerWidth(); // 下拉框宽度
                var searchValue = $(this).val();
                var pos = $(this).offset();
                var selectDiv = $('.bh-advancedQuery-quick-select');
                pos.top += 28;

                // 回车快速搜索
                if (e.keyCode == 13) {
                    selectDiv.css({'height': 0, 'border-width' : '0'});
                    element.trigger('search', [_getSearchCondition(options), options]);
                    return;
                }

                if (searchValue == '') {
                    selectDiv.css({'height': 0, 'border-width' : '0'});
                } else {
                    $('.bh-advancedQuery-easy-query', selectDiv).html(searchValue);
                    selectDiv.css({
                        'height': easySelectH + 'px',
                        'width': easySelectW + 'px',
                        'border-width': '1px',
                        'top': pos.top,
                        'left': pos.left
                    });
                }
            });

            // 点击下拉快速搜索
            $(document).off('click.emapAdvancedQuery').on('click.emapAdvancedQuery', '[bh-advanced-query-role=advancedEasySelect] p', function(){
                var selectDiv = $('.bh-advancedQuery-quick-select');
                if (selectDiv.height() > 0) {
                    selectDiv.css({'height': 0, 'border-width' : '0'});
                }
                element.trigger('search', [_getSearchCondition(options, $(this).data('name')), options]);
            });

            // 点击搜索按钮  easy search
            $advanced.on('click', '[bh-advanced-query-role=easySearchBtn]', function(){
                element.trigger('search', [_getSearchCondition(options), options]);
            });

            // 点击筛选条件  quick search
            $advanced.on('click', '[bh-advanced-query-role=quickSearchForm] .bh-label-radio', function(){
                // radio 的事件冒泡问题
                setTimeout(function(){
                    element.trigger('search', [_getSearchCondition(options), options]);
                }, 200);
            });

            // 执行高级搜索
            $advanced.on('click', '[bh-advanced-query-role=advancedSearchBtn]', function(){
                _getSearchCondition(options);
                element.trigger('search', [_getSearchCondition(options), options]);
            });

            $advancedModal.on('click', function (e) {
                var target = e.target;
                if ($(target).closest('.bh-advancedQuery-quick-search-wrap').length == 0) {
                    $('.bh-advancedQuery-quick-select').css({'height': 0, 'border-width' : '0'});
                }
            });

            // easySearch 下拉框的关闭
            $(document).on('click', function(e){
                var target = e.target;
                if ($(target).closest('[bh-advanced-query-role=advancedEasySelect]').length == 0){
                    var selectDiv = $('.bh-advancedQuery-quick-select');
                    if (selectDiv.height() > 0) {
                        selectDiv.css({'height': 0, 'border-width' : '0'})
                    }
                }
            });


        };

        _addTime = function ($item) {
            var $groupParent = $item.closest(".bh-advancedQuery-addBlock");
            $groupParent.addClass("bh-active");
            var $addTime = $groupParent.children("div[bh-advanced-query-role=addTime]");
            $groupParent.children("div[bh-advanced-query-role=addTimeGroup]").show();
            $addTime.hide();
        };

        _cancelAddTime = function ($item) {
            var $groupParent = $item.closest(".bh-advancedQuery-addBlock");
            $groupParent.removeClass("bh-active");
            var $addTimeGroup = $groupParent.children("div[bh-advanced-query-role=addTimeGroup]");
            $addTimeGroup.removeClass("bh-entryLeft").addClass("bh-outLeft");
            $groupParent.children("div[bh-advanced-query-role=addTime]").addClass("bh-entryRight").show();

            setTimeout(function () {
                $addTimeGroup.removeClass("bh-outLeft").addClass("bh-entryLeft").hide();
            }, _animateTime());
        };

        _renderEasySearch = function (easyArray, $advanced) {
            var easySearch = '';
            var easySearchPlaceholder = ''; // easySearch 文本框placeholder
            if (easyArray.length && easyArray.length > 0) {
                easySearchPlaceholder += '请输入';
                $(easyArray).each(function () {
                    easySearchPlaceholder += this.caption + '/';
                    easySearch += '<p data-name="' + this.name + '">搜索 <span class="bh-advancedQuery-easy-caption">' + this.caption + '</span> : <span class="bh-advancedQuery-easy-query"></span></p>';
                });
                $('.bh-advancedQuery-quick-select').html(easySearch);
                easySearchPlaceholder = easySearchPlaceholder.substring(0, easySearchPlaceholder.length-1);
                $('.bh-advancedQuery-quick-search-wrap input[type=text]', $advanced).attr('placeholder', easySearchPlaceholder);
            }
        };

        _renderQuickSearch = function (quickArray) {
            var quickSearchHtml = $('<div></div>');
            $(quickArray).each(function (i) {
                /**
                 * 代码不做 数量显示
                 * 由设计规范控制
                 */
                //if (i >= 3) {
                //    return false;
                //}
                if(this.xtype == 'select' || this.xtype == 'radiolist' || this.xtype == 'checkboxlist') {
                    this.xtype = 'buttonlist';
                }
                quickSearchHtml.append(_renderInputPlace(this));
            });
            return quickSearchHtml;
        };

        _renderInputPlace = function (item, showClose) {
            //showClose  是否显示 关闭按钮
            var _this = item;
            _this.get = function (attr) {
                return _this[attr];
            };
            var xtype = _this.get("xtype");
            var caption = _this.get("caption");
            var builder = _this.get("defaultBuilder");
            var url = _this.get("url");
            var name = _this.get("name");
            var hidden = _this.get("hidden") ? "hidden" : "";
            var placeholder = _this.get("placeholder") ? _this.get("placeholder") : "";
            var checkType = _this.get("checkType");
            var checkSize = _this.get("checkSize");
            var dataSize = _this.get("dataSize");
            var checkExp = _this.get("checkExp");
            var format = _this.get("format") ? _this.get("format") : 'yyyy-MM-dd';
            var controlHtml = $(' <div class="bh-advancedQuery-form-row bh-advancedQuery-h-28">' +
                '<div class="bh-advancedQuery-groupName">' + caption + '：</div>' +
                '<div class="bh-advancedQuery-groupList bh-label-radio-group">' +
                '</div>' +
                '</div>');

            if(showClose) {
                controlHtml.append('<a class="bh-bh-advancedQuery-group-dismiss" href="javascript:void(0)" bh-advanced-query-role="conditionDismiss"> ' +
                    '<i class="icon-close iconfont"></i>' +
                    '</a>');
            }
            switch (xtype) {

                case "tree" :
                    $('.bh-advancedQuery-groupList', controlHtml).html('<div xtype="' + xtype + '" data-name="' + name + '" data-builder="' + builder + '" data-caption="' + caption + '" data-url="' + url + '" ' + (hidden ? 'style="display:none;"' : '') + ' ></div>');
                    break;
                case "date-local" :
                case "date-ym" :
                    $('.bh-advancedQuery-groupList', controlHtml).html('<div xtype="' + xtype + '" data-builder="' + builder + '" data-caption="' + caption + '" data-name="' + name + '" ' + (hidden ? 'style="display:none;"' : '') + '></div>');
                    break;
                case "switcher" :
                    $('.bh-advancedQuery-groupList', controlHtml).html('<div xtype="switcher"  data-builder="' + builder + '" data-caption="' + caption + '" data-name="' + name + '" ' + (hidden ? 'style="display:none;"' : '') + '></div>');
                    break;
                case "radiolist" :
                    $('.bh-advancedQuery-groupList', controlHtml).html('<div xtype="' + xtype + '" data-name="' + name + '" class="bh-radio" data-url="' + url + '" data-builder="' + builder + '" data-caption="' + caption + '" ' + (hidden ? 'style="display:none;"' : '') + '></div>');
                    break;
                case "checkboxlist" :
                    $('.bh-advancedQuery-groupList', controlHtml).html('<div xtype="' + xtype + '" data-name="' + name + '" class="bh-checkbox" data-url="' + url + '" data-builder="' + builder + '" data-caption="' + caption + '" ' + (hidden ? 'style="display:none;"' : '') + '></div>');
                    break;
                case "buttonlist" :
                case "select" :
                    $('.bh-advancedQuery-groupList', controlHtml).html('<div xtype="' + xtype + '" data-name="' + name + '" data-url="' + url + '" data-builder="' + builder + '" data-caption="' + caption + '" ' + (hidden ? 'style="display:none;"' : '') + '></div>');
                    break;
                default:
                    $('.bh-advancedQuery-groupList', controlHtml).html('<input class="bh-form-control" data-name="' + name + '" name="' + name + '" data-builder="' + builder + '" data-caption="' + caption + '" xtype="text" type="text" ' + (hidden ? 'style="display:none;"' : '') + ' />');
                    break;
            }



            return controlHtml;
        };

        _getSelectedConditionFromForm = function(options){
            var selectedForm = $('[bh-advanced-query-role=advanceSearchForm]', options.$advanced);
            var selectedArr = [];
            $('[xtype][data-name]', selectedForm).each(function(){
                selectedArr.push($(this).data('name'));
            });
            return selectedArr;
        };

        _renderConditionList = function (options) {
            var modalArray = options.$advanced.data('modalarray');
            // 获取已选condition 数据
            var selectedArr = _getSelectedConditionFromForm(options);

            if (modalArray.length && modalArray.length > 0) {
                var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
                var itemHtml = '';
                $(modalArray).each(function(){
                    if ($.inArray(this.name, selectedArr) > -1) {
                        //已添加字段
                        itemHtml += ' <li>' +
                            '<div class="bh-checkbox"><label><input type="checkbox" name="' + this.name + '" data-caption="' + this.caption + '" checked>' +
                            '<i class="bh-choice-helper"></i>' + this.caption +
                            '</label></div>' +
                            '</li>';
                    } else {
                        //未添加字段
                        itemHtml += ' <li>' +
                            '<div class="bh-checkbox"><label><input type="checkbox" name="' + this.name + '" data-caption="' + this.caption + '">' +
                            '<i class="bh-choice-helper"></i>' + this.caption +
                            '</label></div>' +
                            '</li>';
                    }

                });

                addList.html(itemHtml);
                _refreshConditionNum();
            }

        };

        // 添加搜索字段
        _addToConditionList = function () {
            var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var addedList = $('[bh-advanced-query-role=addedList]', options.$advancedModal);
            var itemHtml = '';
            var inputArr = $('input[type=checkbox]:checked', addList);

            if (inputArr.length > 0) {
                inputArr.each(function(){
                    var name = $(this).attr('name');
                    var caption = $(this).data('caption');
                    itemHtml += ' <li>' +
                        '<div class="bh-checkbox"><label><input type="checkbox" name="' + name + '" data-caption="' + caption + '">' +
                        '<i class="bh-choice-helper"></i>' + caption +
                        '</label></div>' +
                        '</li>';

                    $(this).closest('li').remove();
                });
                addedList.append(itemHtml);
                _refreshConditionNum();
            }
        };

        // 移除已选字段
        _removeFromConditionList = function () {
            var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var addedList = $('[bh-advanced-query-role=addedList]', options.$advancedModal);
            var itemHtml = '';
            var inputArr = $('input[type=checkbox]:checked', addedList);

            if (inputArr.length > 0) {
                inputArr.each(function(){
                    var name = $(this).attr('name');
                    var caption = $(this).data('caption');
                    itemHtml += ' <li>' +
                        '<div class="bh-checkbox"><label><input type="checkbox" name="' + name + '" data-caption="' + caption + '">' +
                        '<i class="bh-choice-helper"></i>' + caption +
                        '</label></div>' +
                        '</li>';

                    $(this).closest('li').remove();
                });
                addList.append(itemHtml);
                _refreshConditionNum();
            }
        };

        // 刷新弹框内字段数量展示
        _refreshConditionNum = function (){
            var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var addedList = $('[bh-advanced-query-role=addedList]', options.$advancedModal);
            var addCount = $('input[type=checkbox]', addList).length;
            var addedCount = $('input[type=checkbox]', addedList).length;
            $('.bh-advancedQuery-dialog-list-head span', addList).html(addCount);
            $('.bh-advancedQuery-dialog-list-head span', addedList).html(addedCount);
        };

        _getSelectedConditionFromModal = function(options) {
            var itemList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var inputArr = $('input[type=checkbox]:checked', itemList);

            return inputArr.map(function(){
                return $(this).attr('name');
            }).get();
        };

        // 渲染高级搜索表单
        _renderAdvanceSearchForm = function(options) {
            var selectedArr =_getSelectedConditionFromModal(options);
            var advanceForm = $('[bh-advanced-query-role=advanceSearchForm]', options.$advanced);
            var btnWrap = $('[bh-advanced-query-role=dropDownBtnWrap]', advanceForm);
            $(options.$advanced.data('modalarray')).each(function(){
                var formItem = $('[data-name=' + this.name + ']', advanceForm);
                if ($.inArray(this.name, selectedArr) > -1) {
                    if (formItem.length > 0) {
                        // 表单已有字段
                        return true;
                    } else {
                        // 表单添加字段
                        btnWrap.before(_renderInputPlace(this));
                    }
                } else {
                    if (formItem.length > 0) {
                        // 表单删除字段
                        formItem.closest('.bh-advancedQuery-form-row').remove();
                    }
                }
            });
            advanceForm.emapFormInputInit();
        };

        // 生成搜索条件
        _getSearchCondition = function (options, name){
            var conditionResult = [];
            var easyArray = options.$advanced.data('easyarray');
            var orCondition = [];
            if (options.searchModel == 'easy') {
                var searchKey = $('.bh-advancedQuery-quick-search-wrap input', options.$advanced).val();
                // 简单搜索
                if ($.trim(searchKey) != "") {
                    if (name) {
                        //简单搜索的下拉框搜索
                        var searchItem = _findModel(name, easyArray);
                        conditionResult.push({
                            "caption": searchItem.caption,
                            "name": searchItem.name,
                            "value": searchKey,
                            "builder": searchItem.defaultBuilder,
                            "linkOpt": "AND"
                        });
                    } else {

                        for (var i = 0; i < easyArray.length; i ++) {
                            orCondition.push({
                                "caption": easyArray[i].caption,
                                "name": easyArray[i].name,
                                "value": searchKey,
                                "builder": easyArray[i].defaultBuilder,
                                "linkOpt": "OR"
                            });
                        }
                        conditionResult.push(orCondition);
                    }
                }
                conditionResult = conditionResult.concat(_getConditionFromForm($('[bh-advanced-query-role=quickSearchForm]', options.$advanced)));
            } else if (options.searchModel == 'advanced') {
                var advancedKeyWord = $('[bh-advanced-query-role=advancedInput]', options.$advanced).val();
                // 高级搜索
                if ($.trim(advancedKeyWord) != '') {
                    for (var i = 0; i < easyArray.length; i ++) {
                        orCondition.push({
                            "caption": easyArray[i].caption,
                            "name": easyArray[i].name,
                            "value": advancedKeyWord,
                            "builder": easyArray[i].defaultBuilder,
                            "linkOpt": "OR"
                        });
                    }
                    conditionResult.push(orCondition);
                }
                conditionResult = conditionResult.concat(_getConditionFromForm($('[bh-advanced-query-role=advanceSearchForm]', options.$advanced)));
            }
            return JSON.stringify(conditionResult);
        };

        _getConditionFromForm = function (form) {
            var conditionArray = [];
            var formElement = $('[xtype]', form);
            for (var i = 0; i < formElement.length; i ++) {
                var conditionItem = {};
                switch ($(formElement[i]).attr('xtype')) {
                    case 'radiolist' :
                        conditionItem.value = $('input[type=radio]:checked', formElement[i]).map(function(){
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'checkboxlist' :
                        conditionItem.value = $('input[type=checkbox]:checked', formElement[i]).map(function(){
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'tree' :
                        conditionItem.value = $(formElement[i]).emapDropdownTree('getValue');
                        break;
                    case 'buttonlist' :
                        conditionItem.value = $('.bh-label-radio.bh-active', formElement[i]).data('id');
                        break;
                    default :
                        conditionItem.value = $(formElement[i]).val();
                        break;
                }
                if (conditionItem.value == 'ALL' || $.trim(conditionItem.value) == '' ) {continue;}
                conditionItem.name = $(formElement[i]).data('name');
                conditionItem.caption = $(formElement[i]).data('caption');
                conditionItem.builder = $(formElement[i]).data('builder');
                conditionItem.linkOpt = 'AND';
                conditionArray.push(conditionItem);
            }
            return conditionArray;
        };

        _findModel = function (name, modelArray) {
            for (var i = 0; i < modelArray.length; i++) {
                if (modelArray[i].name == name) {
                    return modelArray[i];
                }
            }
        };

        //.css({"overflow": "hidden","position": "relative"})
        element.css({"position": "relative", "z-index": 358}).html('<div class="bh-advancedQuery bh-mb-16" bh-advanced-query-role="advancedQuery">' +
            '<div class="bh-advancedQuery-dropDown ">' +
            '<div class="" style="display: table-cell">' +
            '<div class="bh-advancedQuery-form" bh-advanced-query-role="advanceSearchForm" >' +
            '<div class="bh-advancedQuery-form-row bh-advancedQuery-h-28">' +
            '<div class="bh-advancedQuery-groupName">关键词：</div>' +
            '<div class="bh-advancedQuery-groupList">' +
            '<input type="text" bh-advanced-query-role="advancedInput" class="bh-form-control">' +
            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-form-row bh-advancedQuery-form-btn-row bh-advancedQuery-h-28" bh-advanced-query-role="dropDownBtnWrap"> ' +
            '<div class="bh-advancedQuery-groupName"></div>' +
            '<div class="bh-advancedQuery-groupList">' +
            '<a class="bh-btn bh-btn-primary" bh-advanced-query-role="advancedSearchBtn" href="javascript:void(0)">执行高级搜索</a>' +
            '<a class="bh-btn bh-btn-default" bh-advanced-query-role="addCondition" href="javascript:void(0)">添加搜索字段</a>' +
            //'<a class="bh-btn bh-btn-default" href="javascript:void(0)">保存为方案</a>' +
            '<a class="bh-mh-4" bh-advanced-query-role="advancedClose" href="javascript:void(0)">[关闭高级搜索]</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            //'<div class="bh-advancedQuery-dropDown-program">' +
            //'<ul class="">' +
            //'<li class="bh-advancedQuery-dropDown-program-head">高级搜索方案(<span>12</span>)</li>' +
            //'<li>' +
            //'<a href="javascript:void(0)"><i class="iconfont icon-delete"></i></a>' +
            //'<a href="javascript:void(0)"><i class="iconfont icon-tuding"></i></a>' +
            //'<span>保存的搜索方案</span>' +
            //'</li>' +
            //'<li>' +
            //'<a href="javascript:void(0)"><i class="iconfont icon-delete"></i></a>' +
            //'<a href="javascript:void(0)"><i class="iconfont icon-tuding"></i></a>' +
            //'<span>保存的搜索方案2</span>' +
            //'</li>' +
            //'<li>' +
            //'<a href="javascript:void(0)"><i class="iconfont icon-delete"></i></a>' +
            //'<a href="javascript:void(0)"><i class="iconfont icon-tuding"></i></a>' +
            //'<span>保存的搜索方案1</span>' +
            //'</li>' +
            //'</ul>' +
            //'</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-quick">' +
            '<div class="bh-advancedQuery-inputGroup bh-mb-8 bh-clearfix">' +
            '<div class="bh-advancedQuery-quick-search-wrap" >' +
            '<input type="text" class="bh-form-control"/>' +
            '<i class="iconfont icon-search" style="position: absolute;left: 6px;top: 6px;"></i>' +
            //'<div class="bh-advancedQuery-quick-select" bh-advanced-query-role="advancedEasySelect">' +
            //'</div>' +
            '</div>' +
            '<a class="bh-btn bh-btn bh-btn-primary bh-btn-small" bh-advanced-query-role="easySearchBtn" href="javascript:void(0);">搜索</a>' +
            '<a href="javascript:void(0);" class="bh-mh-8" bh-advanced-query-role="advancedOpen">[高级搜索]</a>' +
            '</div>' +
            '<div class="bh-advancedQuery-form" bh-advanced-query-role="quickSearchForm">' +
            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-dialog" bh-advanced-query-role="addDialog" data-guid="' + guid + '">' +
            '<div class="bh-advancedQuery-dialog-head">添加搜索字段</div>' +
            '<div class="bh-advancedQuery-dialog-content bh-row">' +
            '<ul class="bh-advancedQuery-dialog-list" bh-advanced-query-role="addList"></ul>' +
            '</div>' +
            '<a href="javascript:void(0)" bh-advanced-query-role="addDialogConfirm" class="bh-btn bh-btn-primary" >添加完成</a>' +
            '<a href="javascript:void(0)" bh-advanced-query-role="addDialogCancel" class="bh-btn bh-btn-default" >取消</a>' +
            '</div>' +
            '</div>');

        options.$advanced = $('div[bh-advanced-query-role=advancedQuery]', element).css({'overflow': 'hidden'});
        options.guid = guid;

        // easySearch 下拉搜索框 占位
        if ($('[bh-advanced-query-role=advancedEasySelect]').length == 0) {
            $('body').append('<div class="bh-advancedQuery-quick-select" bh-advanced-query-role="advancedEasySelect"></div>');
        }

        // 添加搜索条件弹框 初始化
        $('[bh-advanced-query-role=addDialog]', options.$advanced).jqxWindow({
            resizable: false,
            draggable: false,
            isModal: true,
            modalOpacity: 0.3,
            width: 548,
            height: 400,
            autoOpen: false
        });
        options.$advancedModal = $('[bh-advanced-query-role=addDialog][data-guid=' + options.guid + ']');
        _eventBind(options.$advanced, options.$advancedModal);


        $(modalData).each(function () {
            //移除 hidden 项
            var index = modalData.indexOf(this);
            if(this.get('hidden')) {
                modalData.splice(index, 1);
                return true;
            }

            if (this.quickSearch) {

                if (!this.xtype || this.xtype == 'text') {
                    easyArray.push(this);
                } else {
                    quickArray.push(this);
                }
            }
        });

        options.$advanced.data('modalarray', modalData);
        options.$advanced.data('easyarray', easyArray);
        options.$advanced.data('quickarray', quickArray);

        // 简单搜索 条件渲染
        _renderEasySearch(easyArray, options.$advanced);

        // 快速搜索条件渲染
        quickArray = JSON.parse(JSON.stringify(quickArray));
        $('[bh-advanced-query-role=quickSearchForm]', options.$advanced).html(_renderQuickSearch(quickArray))
            .emapFormInputInit({root: ''});

        options.searchModel = 'easy';


        //$.ajax({
        //    type: 'get',
        //    url: searchModalUrl,
        //    dataType: 'json'
        //}).done(function (res) {
        //    $(res).each(function () {
        //        if (this.quickSearch) {
        //
        //            if (!this.xtype || this.xtype == 'text') {
        //                easyArray.push(this);
        //            } else {
        //                quickArray.push(this);
        //            }
        //        }
        //    });
        //
        //    options.$advanced.data('modalarray', res);
        //    options.$advanced.data('easyarray', easyArray);
        //    options.$advanced.data('quickarray', quickArray);
        //
        //    // 简单搜索 条件渲染
        //    _renderEasySearch(easyArray, options.$advanced);
        //
        //    // 快速搜索条件渲染
        //    quickArray = JSON.parse(JSON.stringify(quickArray));
        //    $('[bh-advanced-query-role=quickSearchForm]', options.$advanced).html(_renderQuickSearch(quickArray))
        //        .emapFormInputInit({root: ''});
        //
        //    options.searchModel = 'easy';
        //}).fail(function (error) {
        //});
    };



    $.fn.emapAdvancedQuery = function (options) {
        var instance;
        instance = this.data('plugin');
        if (!instance) {
            return this.each(function () {
                return $(this).data('plugin', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options]();
        return this;
    };

    $.fn.emapAdvancedQuery.defaults = {
        allowAllOption: true // 是否显示[全部]选项
    };

}).call(this);

/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function () {   
    /**
     * 定义一个插件
     */
    var Plugin;
     
    /**
     * 这里是一个自运行的单例模式。 
     */
    Plugin = (function () {
 
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.emapdatatable.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);

            //拼接请求地址
            var url = this.settings.url || WIS_EMAP_SERV.getAbsPath(this.settings.pagePath).replace('.do', '/' + this.settings.action + '.do');

            //前端模拟数据开发时type使用get方式
            var ajaxMethod = this.settings.method || 'POST';
            if(typeof window.MOCK_CONFIG != 'undefined'){
                ajaxMethod = this.settings.method || 'GET';
                if(typeof this.settings.url == 'undefined'){
                    var models = BH_UTILS.doSyncAjax(url, {}, ajaxMethod).models;
                    for(var i = 0; i < models.length; i++){
                        if(models[i].name == this.settings.action){
                            url = models[i].url;
                            break;
                        }
                    }
                }
            }
            //数据源
            this.source = {
                root:'datas>' + this.settings.action + '>rows',
                id: this.settings.pk || 'WID',   // id: "WID", 主键字段可配置  //qiyu 2016-1-16
                datatype: 'json',
                url: url,
                data: this.settings.params || {},
                type: ajaxMethod,
                datafields: []
            };

            _create(this);
        }
 
        /**
         * 插件的公共方法，相当于接口函数，用于给外部调用
         */
        Plugin.prototype.reload = function (params) {
            /**
             * 方法内容
             */
            this.source.data = params;
            if(!this.$element.jqxDataTable('goToPage', 0)){
                this.$element.jqxDataTable('updateBoundData');
            }
        };

        Plugin.prototype.checkedRecords = function(){
            var selectedArr = [];
            var rowsData = this.$element.jqxDataTable('getRows');
            this.$element.find('tr').each(function(index){
                var ischecked = $(this).find('input[type="checkbox"]').prop('checked');
                if(ischecked){
                    selectedArr.push(rowsData[index]);
                }
            });
            return selectedArr;
        };

        Plugin.prototype.getSort = function () {
            var args = this.$element.data("sortfield");

            if(args === undefined)
                return;

            var sortObj = {
                direction: args.sortdirection,
                field:args.sortcolumn,
                exp:""
            };
            var exp = "";
            if(args.sortdirection.ascending == true){
                sortObj.exp = "+" + args.sortcolumn;
            }else if(args.sortdirection.descending == true){
                sortObj.exp = "-" + args.sortcolumn;
            }

            return sortObj;
        };
         
        return Plugin;
 
    })();
    
    /**
     * 插件的私有方法
     */
    //生成表格
    function _create(instance){
        var jqxOptions = $.extend({}, instance.settings);
        try{
            delete jqxOptions.pk;   //qiyu 2016-1-16 
            delete jqxOptions.url;
            delete jqxOptions.pagePath;
            delete jqxOptions.params;
            delete jqxOptions.datamodel;
            delete jqxOptions.method;
            delete jqxOptions.action;
            delete jqxOptions.customColumns;
        }catch(e){

        }
        

        var dataAdapter = new $.jqx.dataAdapter(instance.source, {
            formatData: function (data) {
                data.pageSize = data.pagesize;
                data.pageNumber = data.pagenum + 1;
                var sortorder = '+';
                if(jqxOptions.sortable && data.sortdatafield && data.sortorder){
                    if(data.sortorder == 'asc'){
                        sortorder = '+';
                    }else if(data.sortorder == 'desc'){
                        sortorder = '-';
                    }
                    data['*order'] = sortorder + data.sortdatafield.split('_DISPLAY')[0];
                }

                delete data.pagesize;
                delete data.pagenum;
                delete data.filterslength;
                delete data.sortdatafield;
                delete data.sortorder;
                return data;
            },
            downloadComplete: function(data, status, xhr){
                //如果未登录则跳转至登录地址
                // console.log("emapdatatable:------------");
                // console.log(data);
                // console.log(xhr);
                // console.log(status);
                // console.log("-----------:emapdatatable");
                if(typeof data.loginURL != 'undefined' && data.loginURL != ''){
                    window.location.href = data.loginURL;
                    return;
                }
                instance.source.totalRecords = data.datas[instance.settings.action].totalSize;
            }
        });
        jqxOptions.columns = _genColums(instance, jqxOptions);
        jqxOptions.source = dataAdapter;

        instance.$element.jqxDataTable(jqxOptions);

        instance.$element.on('sort', function (event) {
            var args = event.args;
            // column's data field.
            //var sortcolumn = args.sortcolumn;
            instance.$element.data("sortfield", args);
        });
    }

    /**
     * 生成表格列
     */
    function _genColums(instance, jqxOptions){
        var columns = [];

        var datamodel = instance.settings.datamodel || 
                            WIS_EMAP_SERV.getModel(instance.settings.pagePath, instance.settings.action, "grid");
        //console.log(datamodel);
        var datafield;

        var cusColLen = 0;
        if(typeof instance.settings.customColumns != 'undefined' && instance.settings.customColumns != null){
            cusColLen = instance.settings.customColumns.length;
        }

        for(var i = 0; i < datamodel.length; i++){
            //设置数据类型全部是string
            instance.source.datafields.push({name: datamodel[i].name, type: 'string'});
            if(typeof datamodel[i].url != 'undefined'){
                datafield = datamodel[i].name + '_DISPLAY';
                instance.source.datafields.push({name: datafield, type: 'string'});
            }else{
                datafield = datamodel[i].name
            }
            if(datamodel[i].get('hidden') === true) continue;
            columns.push({
                text: datamodel[i].caption, 
                datafield: datafield
            }); 
        }

        for(var j = 0; j < cusColLen; j++){
            var index = instance.settings.customColumns[j].colIndex;
            var colField = instance.settings.customColumns[j].colField;
            var type = instance.settings.customColumns[j].type;
            var showCheckAll = instance.settings.customColumns[j].showCheckAll;
            if(index == 'last'){
                index = columns.length;
            }
            index = index > columns.length ? columns.length : index;
            index = index < 0 ? 0 : index;
            if(type == 'checkbox'){
                columns.splice(index, 0, _genCustomColumns(type, instance, jqxOptions, showCheckAll));
            }else if(type == 'tpl'){
                if(typeof colField != 'undefined' && colField != ''){
                    for(var k = 0; k < columns.length; k++){
                        if(columns[k].datafield == colField || columns[k].datafield == (colField + '_DISPLAY')){
                            columns[k] = $.extend(columns[k], instance.settings.customColumns[j].column);
                        }
                    }
                }else if(typeof index != 'undefined'){
                    columns.splice(index, 0, instance.settings.customColumns[j].column);
                }
            }else if(type == 'link'){
                if(typeof colField != 'undefined' && colField != ''){
                    for(var k = 0; k < columns.length; k++){
                        if(columns[k].datafield == colField || columns[k].datafield == (colField + '_DISPLAY')){
                            columns[k] = $.extend(columns[k], _genCustomColumns(type, instance, jqxOptions));
                        }
                    }
                }else if(typeof index != 'undefined'){
                    columns[index] = $.extend(columns[index], _genCustomColumns(type, instance, jqxOptions));
                }
                
            }
        }

        return columns;
    }

    /**
     * 生成自定义列
     * @param  {String} type 自定义列类型
     * @return {Object}       自定义列column
     */
    function _genCustomColumns(type, instance, jqxOptions, showCheckAll){
        var column = [];
        switch(type){
        case 'checkbox': 
            column = {
                text: 'checkbox', width: 32, cellsAlign: 'center', align: 'center',
                renderer: function (text, align, height) {
                    var checkBox = '<div class="selectAllCheckboxFlag bh-checkbox bh-mh-8"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';
                    if(showCheckAll === false){
                        return ' ';
                    }
                    return checkBox;
                },
                rendered: function (element, align, height) {
                    //头部的checkbox点击事件的绑定
                    element.on("click", "input", function(e){
                        var $table = instance.$element;
                        var $tableContent = $table.find("table");
                        var $checkboxList = $tableContent.find("div.bh-checkbox");

                        var $input = $(this);
                        if($input.hasClass("selectFlag")){
                            $input.prop("checked", false).removeClass("selectFlag");
                            $checkboxList.each(function(){
                                $(this).find("input").prop("checked", false);
                            });
                        }else{
                            $input.prop("checked", true).addClass("selectFlag");
                            $checkboxList.each(function(){
                                $(this).find("input").prop("checked", true);
                            });
                        }

                        //触发自定义全选按钮事件
                        $(this).trigger('checkall');
                        e.stopPropagation();
                    });
                    return true;
                },
                cellsRenderer: function (row, column, value, rowData) {
                    var checkBox = '<div data-sss="" class="bh-checkbox bh-mh-4"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';
                    
                    return checkBox;
                }
            };

            //增加处理函数
            jqxOptions.rendered = function(){
                //数据加载完成，读取各列的checkbox，判断头部的checkbox是否要勾选
                var $table = instance.$element;
                var $tableContent = $table.find("table");
                var $checkboxList = $tableContent.find("div.bh-checkbox");
                var isSelectAllFlag = true;
                if($checkboxList.length == 0){
                    isSelectAllFlag = false;
                }
                $checkboxList.each(function(){
                    var $itemCheckbox = $(this);
                    if($itemCheckbox.find("input[checked]").length === 0){
                        isSelectAllFlag = false;
                        return;
                    }
                });
                var $selectAllCheckbox = $table.find("div.selectAllCheckboxFlag").find("input");
                if(isSelectAllFlag){
                    $selectAllCheckbox.prop("checked", true).addClass("selectFlag");
                }else{
                    $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
                }
            };

            jqxOptions.ready = function(){
                //初始化完成后，绑定checkbox的点击事件
                instance.$element.on("click", "div.bh-checkbox", function(){
                    _scenesTableContentCheckboxClick($(this).find("input"), instance);
                    //触发自定义事件
                    $(this).trigger('checkone');
                });
            };
            break;

        case 'link':
            column = {
                cellsRenderer: function(row, column, value, rowData){
                    if(!isNaN(value)){
                        value = value.toString();
                    }
                    return '<a href="javascript:void(0);" class="j_link_' + column + '">' + value + '</a>';
                }
            }
            break;
        }
        return column;
    }


    /**
     * 点击tbody上的checkbox，处理头部的checkbox是否要勾选
     * @param $input
     */
    function _scenesTableContentCheckboxClick($input, instance){
        if(!$input.hasClass("selectAllCheckboxFlag")){
            var $table = instance.$element;
            var $selectAllCheckbox = $table.find("div.selectAllCheckboxFlag").find("input");
            var $tableContent = $table.find("table");
            var $checkboxList = $tableContent.find("div.bh-checkbox");
            if($input.prop("checked")){
                var isSelectAllFlag = true;
                $checkboxList.find("input").each(function(){
                    if(!$(this).prop("checked")){
                        isSelectAllFlag = false;
                    }
                });

                if(isSelectAllFlag){
                    $selectAllCheckbox.prop("checked", true).addClass("selectFlag");
                }else{
                    $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
                }
            }else{
                $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
            }
        }
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapdatatable = function (options, params) {
        var instance;
        instance = this.data('emapdatatable');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('emapdatatable', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };
     
    /**
     * 插件的默认值
     */
    var height = null;
    if(typeof BH_UTILS != 'undefined'){
        height = BH_UTILS.getTableHeight(10);
    }

    var localization = null;
    if(typeof Globalize != 'undefined'){
        localization = Globalize.culture("zh-CN");
    }

    $.fn.emapdatatable.defaults = {
        width: '100%',
        height: height,
        pageable: true,
        pagerMode: 'advanced',
        serverProcessing: true,
        pageSizeOptions: ['10','20','50','100'],
        localization: localization, 
        sortable: false,
        enableBrowserSelection: true
    };

}).call(this);
 (function () {
    var Plugin,
        _create,
        _getRecords, _getFullPath;  //插件的私有方法
    Plugin = (function () {
        function Plugin(element, options) {
            this.settings = $.extend({}, $.fn.emapDropdownTree.defaults, options);
            this.$element = $(element);
            _create(this.$element, this.settings);
        }
        Plugin.prototype.getValue = function () {
            return $(this.$element.data('values')).map(function(){
                return this.value;
            }).get().join(',');
        };

        Plugin.prototype.setValue = function (params) {
            var val = params[0];
            var display_val = params[1];
            this.$element.jqxDropDownButton('setContent', display_val);
            this.settings.$tree.jqxTree('checkItem', $('#' + val, this.settings.$tree), true);

            $(this.$element.data('values')).map(function(){
                return this.value;
            }).get().join(',');
        };

        Plugin.prototype.disable = function(){
            this.$element.jqxDropDownButton({disabled : true});
        };
        Plugin.prototype.enable = function(){
            this.$element.jqxDropDownButton({disabled : false});
        };
        return Plugin;

    })();

    /**
     * 插件的私有方法
     */
    _create = function ($dom, setting) {
        //var _tpl = `<input id="searchInput" type="text"/><div style="border: none;" id='jqxTree'></div>`;
        //$dom.append(_tpl);

        //var $inputGroup = $("#input", $dom);
        //var $searchInput = $("#searchInput", $dom);
        //var $searchBtn = $("#searchBtn", $dom);
        //var $tree = $('#jqxTree', $dom);


        setting.$tree = $('<div style="border: none;" class="dropdown-tree"></div>');
        $dom.append(setting.$tree);

        if(setting.checkboxes){
            setting.$tree.on('checkChange', function(event){
                var args = event.args;
                var item = setting.$tree.jqxTree('getCheckedItems', args.element);
                var values = [];
                var dropDownContent = item.map(function(cv){
                  values.push({"label":cv.label, "value":cv.value});
                  return cv.label;
                }).join(",");
                $dom.jqxDropDownButton('setContent', dropDownContent);
                $dom.data({"values":values});
            });
        }else{
            setting.$tree.on('select', function (event) {
                var args = event.args;
                var item = setting.$tree.jqxTree('getItem', args.element);
                var values = [];
                // var dropDownContent = item.label;
                var dropDownContent = _getFullPath(item, setting.$tree).reverse().join("/");
                var dropDownValue = item.value;
                values.push({"label":dropDownContent, "value":dropDownValue});
                $dom.jqxDropDownButton('setContent', dropDownContent);
                $dom.data({"values":values});
                $dom.trigger("select", [values]);
                $dom.jqxDropDownButton('close');
            });
        }

        if(setting.search){
            var $searchInput = $('<input class="treeSearchInput" type="text" class="bh-form-control" placeHolder="搜索..."/>');
            setting.$tree.before($searchInput);
            $searchInput.keyup(function () {
                var value = $searchInput.val();
                console.debug("Searching for: " + value);
                if(setting.url){
                }else{
                    var syncData = $dom.data("emapDropdownTree").settings.datas.datas.code.rows;
                    var filterData = syncData.filter(function(data){
                        return (data.name.indexOf(value) > -1);
                    });

                    var records = _getRecords({"datas":{"code":{"rows":filterData}}});

                    setting.$tree.jqxTree("clear");
                    var treeParams = $.extend({height: 220, hasThreeStates: false, source: records}, {"checkboxes":setting.checkboxes});
                    setting.$tree.jqxTree(treeParams);
                }
                
                $dom.trigger("search", [value]);
            });
        }

        if(setting.url){
            var source =
            {
                datatype: "json",
                root:"datas>code>rows",
                datafields: [
                    { name: 'id' },
                    { name: 'pId' },
                    { name: 'name' },
                    { name: 'isParent'}
                ],
                id: 'id',
                url: setting.url,
                data: $.extend({pId:""},setting.params)
            };
            var dataAdapter = new $.jqx.dataAdapter(source, {
                beforeLoadComplete: function (loaded_data, original_data) {
                    var new_data = [];
                    for (var i = 0; i < loaded_data.length; i++) {
                        var item = loaded_data[i];
                        new_data.push({id:item.id + item.name, name:item.name, pId:"...", value:item.id});
                        if(item.isParent === 1){
                            var sub_item = {id: item.id, name: "加载中...", pId: item.id + item.name, value:item.id};
                            new_data.push(sub_item);
                        }
                    }
                    return new_data;
                },
                loadComplete: function () {
                    // dataAdapter.records
                    var records = dataAdapter.getRecordsHierarchy('id', 'pId', 'items', [{ name: 'name', map: 'label'}]);
                    var treeParams = $.extend({width:"100%", height: 220, hasThreeStates: false, source: records, checkSize:16}, {"checkboxes":setting.checkboxes});

                    setting.$tree.on('expand', function (event) {
                        var label = setting.$tree.jqxTree('getItem', event.args.element).label;
                        var $element = $(event.args.element);
                        var loader = false;
                        var loaderItem = null;
                        var children = $element.find('ul:first').children();
                        $.each(children, function () {
                            var item = setting.$tree.jqxTree('getItem', this);
                            if (item && item.label == '加载中...') {
                                loaderItem = item;
                                loader = true;
                                return false
                            };
                        });
                        if (loader) {
                            $.ajax({
                                url: setting.url,
                                data: {pId:loaderItem.value.replace(".fake", "")},
                                success: function (data, status, xhr) {
                                    var items = data;
                                    if(items.datas && items.datas.code && items.datas.code.rows){
                                        var nodes = items.datas.code.rows;
                                        var treenodes = [];
                                        for (var i = nodes.length - 1; i >= 0; i--) {
                                            var treenode = {label: nodes[i].name, value:nodes[i].id};
                                            if(nodes[i].isParent === 1){
                                                treenode.items = [{"value":nodes[i].id, label:"加载中..."}];
                                            }
                                            treenodes.push(treenode);
                                        };
                                        setting.$tree.jqxTree('addTo', treenodes, $element[0]);
                                        setting.$tree.jqxTree('removeItem', loaderItem.element);
                                    }                                    
                                }
                            });
                        }
                    });
                    setting.$tree.jqxTree(treeParams);
                }
            });
            dataAdapter.dataBind();
        }else{
            var records = _getRecords(setting.datas);
            var treeParams = $.extend({width:"100%", height: 220, hasThreeStates: false, source: records, checkSize:16}, {"checkboxes":setting.checkboxes});
            setting.$tree.jqxTree(treeParams);
        }

        //$inputGroup.jqxInput($.extend({width: "100%", minLength: 1}, setting.placeHolder));
        //$searchInput.jqxInput($.extend({width: "100%", minLength: 1}, setting.placeHolder));
        $dom.jqxDropDownButton({ width: "100%"});
    };

    _getRecords = function(datas){
        var source =
        {
            datatype: "json",
            // root:"datas>code>rows",
            datafields: [
                { name: 'id' },
                { name: 'pId' },
                { name: 'name' }
            ],
            id: 'id',
            localdata: datas
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        var records = dataAdapter.getRecordsHierarchy('id', 'pId', 'items', [{ name: 'name', map: 'label'},{ name: 'id', map: 'value'}]);
        return records;
    }

    _getFullPath = function(treeNode, domTree){
        var path = [];
        path.push(treeNode.label);
        if(domTree.jqxTree('getItem', treeNode.parentElement) != null){
            path = path.concat( _getFullPath(domTree.jqxTree('getItem', treeNode.parentElement), domTree) );
        }
        return path;
    }

    $.fn.emapDropdownTree = function (options, params) {
        var instance;
        instance = this.data('emapDropdownTree');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapDropdownTree', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    $.fn.emapDropdownTree.defaults = {
        width: "100%",
        checkboxes: false,
        search: false
        // property2: 'value'
    };
}).call(this);

//下载
(function () {
    var Plugin, _init;

    Plugin = (function () {
        function Plugin(element, options) {
            if (options.mode) {options.model = options.mode;}
            this.settings = $.extend({}, $.fn.emapFileDownload.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.settings);
        }

        return Plugin;
    })();

    _init = function (element, options) {
        //if (!options.token || options.token == "") { return; }
        $.ajax({
            type: "post",
            url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    var fileHtml = '';
                    if (!res.items || res.items.length == 0) {
                        fileHtml += ' 无';
                        $(element).append(fileHtml);
                        return;
                    }
                    if (options.model == 'file') {
                        $(res.items).each(function () {
                            fileHtml += '<div class="bh-pull-left bh-file-upload-file" data-fileId="' + this.id + '" data-fileurl="' + this.fileUrl + '">' +
                                '<div class="bh-file-upload-file-icon bh-pull-left"><i class="iconfont icon-insertdrivefile"></i></div>' +
                                '<div class="bh-file-upload-file-info bh-pull-left">' +
                                '<span class="bh-file-upload-filename" title="' + this.name + '">' + this.name + '</span>' +
                                '<p><a class="bh-file-upload-download" href="javascript:void(0)">下载</a></p>' +
                                '</div>' +
                                '</div>';
                        });
                        $(element).append(fileHtml).find('.bh-file-upload-download').on("click", function () {
                            var fileBlock = $(this).closest(".bh-file-upload-file");
                            window.location.href = fileBlock.data('fileurl');
                        });
                    } else if (options.model == 'image') {
                        var imgWidth = parseInt(options.width) - 6;
                        var imgHeight = parseInt(options.height) - 6;

                        $(res.items).each(function () {
                            fileHtml += '<div data-fileid="' + this.id + '" data-name="' + this.name + '" class="bh-file-img-block success" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                                '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                                '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                                '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" src="' + this.fileUrl + '" alt="' + this.name + '" />' +
                                '</span>' +
                                '</div>' +
                                '</div>';
                        });
                        $(element).css('overflow', 'hidden').append(fileHtml);
                    }

                }
            }
        });

    };

    $.fn.emapFileDownload = function (options) {
        return this.each(function () {
            return $(this).data('emapfiledownload', new Plugin(this, options));
        });
    };

    $.fn.emapFileDownload.defaults = {
        model : 'file',
        width : 200,
        height : 150
    };

}).call(this);
//上传头像
(function () {
    var Plugin, _init, defaultPhoto;
    var _imgLoad;
    var fileReader = 'FileReader' in window;
    defaultPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAACagliejmSWnmyeimCqkmSilnECmiCmlmSikmiilmyinnCeimCekmieilyimmiagliiimCimmyikmiikmiikmieglielnCimnCilmyehlyekmSijmSalnCimmyikmyilmiaglvanL9ymUCeglt2pWuejQOqXMvaRItytXuOoTO+lO96pVnmmcPaVKPOcK+6pOd6hSeaeSO6oPYmqd2qgdu6rQd+rTtyeRuaZOueVMeesRieglimmnEgrG/aOH/qiHOrAp/LXvOvIrezBqPbZviWnnj8hEkkmFkgrHP2hFujLseK5oCapnx6mov+NGEgoGCWlm/qjHCaupUcqGkoiEf+hGR+kmyqmnPHXvRuhnfeOHv+iEiesoh6flUksHPbKtPmeHUsgD/HUue/Fq+nIrUBIOiehlym2SUYvIPTZvvrfw0ojEzCEeOnAp//bv/rDqTweD0YoGPmNG/LIr/WOH/yNGzB/cxqimhielfLWu/vMryKgmOq/puK/pyajmkynmS+hlem9oiqUif359P///+/KsTO0RkU2JySflfTCqCaxqC2Og0M7LKiDbVCwo/zZvkElFTCJfT2nmNK8o/uiGle0Sz21SDR0aCqbkZx9aGWqm49xXTGonb65pDN5bezEq+vWuyOmnv/ny3q1pfWlJs2VM/qNHeqkIdbDlimjmreaTWugdf+QGzpfUnZXRFehg2BCMPORJeTSuGxOPPXj0bepWfv18HqyoImzoJ26cEm0Qx22RsOnKManSlU3JjtaTNLQt6rFsJ+0ocLMtd61nLqXgOzPtVo8K8Kiij+ija6aUzxWSF+pit3Dp+rEqOmSJ/mOHYmnOGu1XnutOzdqXf+lIdGnP2ipgpepaummMFCqkZbBrveUJ4Cda7ONd2a2psGbhFmypGK1pfTax//9/NuUKUSqdpyiOuPDm4S3YGquP72bLLO/gn+baf6mKYVqVWxhUfLo2nNuXIyuRqaqL+bHoV6sX/qeHUo8LW+qis3LsIiob0QlFfieIdrSudHUgI4AAAA8dFJOUwDtjRAiCvsDGoPPFpni2DzeT+t5a6PGuvavuFYwyEVgc/zoIfczmdfsVYN3FPzn7NtfCsN1f+K4yIiAzsFKH5gAAAhNSURBVFjDpdn3XxPZGgfgkAAhVGmiItLsuvX2ezOTEDGF3RQkCSXEZCkhkICGEhAXkKIgAhqpIiqKiuva69pXd63rqqvu3bu93O3l9vbjnZn0nDMzwf3+AU/ez3vec2ZyhsGgS1BYVDInPiE0IiYmICAgInIWMyUxkMVm/KywQ6JSZkYEI3ikWq1Q2MIlEjCdEx0Y9MRs2BxmqB1FEGGOtH1rZU+ZtMxOc8umhSeGPBEbGJcwA3FGmtNzt7e8vPfuVmfReKZzZk+d5YQi7ki1u8qLVGKxuah8JLvMLXMjmVOjg1IiEc9oK1GVUoKiEqVKUu8lc6dxptCQOUnBXq70oKEIY/FIigzbWrheiUz2d82YMxDvaLeiCtQRhbIy2xvmpsYH+uNGJSG+0Y6oUFdUI0KubyKjaeeanRwDuptGnJ3AezGSkw3Ic2NppjqIE+zLSjcdrDSI3bDYUL9R2gLQ4WFULiseKDdHW29AxahHxKihPhtsxyyKRofNBN1tr0tUXi4mm9G77VJAnk4qsyDu1l5f1k73VgrL/JWDwD5oK7vMShQWc7nPRiG6Ae0zmwNxy8UoScTl9WCfw2GzEZcH9KGni9TF5K4eUI6F7AtgfrUHDWYJOSwxGzYCUzc3GhgIcL9tetesQCmiEL8rBdo8zXcBmeBAtFM1grQZ8T7n2Qxgw+UcIRkId8nmI+DMpXqddUFJkJ3Ra4Z71a7fM/e2Qw4kz/M5Nhjs8C4FvBNKnc4pixW7wA3IZbrdkEjAlUqPqOAFi8aO2py/oXq9BTyOprmfVpw8cG+UGYpgs6azHG/71AlLVIZt4BHKDXcVHIqAcHsXbIh1IuUN/fXjNp1jlGFz4S45DuwwdvrAdrNOZOurLakdtbj2dSUE5nIceyMBgcCVqOfu0OkkqA6ttqCYm1Fy/ZbIXrJCUQ+Dp4eQzDABK1ywstomIoKe+hxzMzJr+0TVjs0HhVMTiVONiVDCSpvtytGx0bG/jY3eaKrNzMBS0nbUoqSo2H7KwZYOf+Lbe6xTiq6M3hOYTKblpsYmgsVSe/uKhaLH9hNjTjAUbndsPMvxgQlThaBRIKh44UUnnKn/VCnCt15XTzYM5mKHHDsFgcJc+xyLbg1M4KrAC24a14/aRDqSOcbngs0ImgmFpdojRVgbq219ExX5Al84o6mktk9nge88Yi5YjJAIKIydFSJLNWq7dW+iWADCuPz5KYsIdlYQb+aBjKhgOKxt/2ffcZvoVKOpEQZnVI3XXu/7ezu8E1xuIiMZ7iINf949cVtnOSow5UNhbAVLVjdvX0MCpzA4cDd3x5urKkw3lFjFZDCW1TtbV8JhJiOeBP5i95Z8gen22E0KuKq7eR0JPIuRQAJ/tmU5hpnynUsHrTizezsJHMkIpYQFywU0MEmTIxgk05a7GW+FV6bUigBGDPni0cPki0cKIw2f5a+qoIYzu6tIx40czs7de3U3JVzVPLB95cYpw5i8Y/PV5eRw987+VlIXgyMQ0mQ3fOTZZ58t3X1uzUoulxwOJYfzsjfnV+TD4arM5nUbyV1s3BIQimRfc5Xc2Cg42dzU1OQaiDeoXGyDhFPB7mmuwHKyeXx8nHaCnVuaQ1lx7kf2mSs+3dHRcRZLR34bMWmrz1G62CGUjFCWjO0TAv6yYz2RszfbqI81R+JID3rnPtl8cpWj5K/Wr//qbHEb3uXVA+vWULrY0zQsAqGWvzhJdKO44vQ/Tn853kb0gdbFHk0kD1PPmq+uwvdJY/ELL7bZ3Z10Lv4wJXn8u4cZaei/Rixgxc1mYo4z3+inc/HHPyNqBk3JSG7etS1En50DvJLOxV9YGCFJdDDSsHdtsRO+v/Y12nodf8o4tHDu3rWlN4tx+H5p6drX6AsOZ5O+xgJwaemyDePjpX7BqdFktwk+y1dAwI740QrHizf0r4Kb3SMT5p3zhM+1thS8TAnHUvy5cbJCmaz/m0f3Nrjh2oH/fnOngIp2/5+ODSZrgkz29pl/DQ/9xwPe8MqFC9++dayggOIAcv31JykZZw8UXurs/EnvhvXnjcNfyx9gdANdwfAuY8398Mw+tVp9YMj4qMRVsv67IeMPGqtVfuKtO9B+pHI8/6RDniOyHe/vK1QP8vnqfxs7z+s3LMPZZfqS743DP8rreJpJ+YNPDkL6Ecryul8BZlnWf7kwi49HzX+Myff1RL77vtP40Krh4bEefrW1gO6OhQO47xUO8u1RH/jBaHz00ytYzg9dND6um+TZ844clMN979y8Twyh7H1HvXb5YedF4/DQ0PDFi8Pf8uQOl1dnlX9SQHFbQWS214G/J+9yId8d9eClxxc6jcbOCw/3y608V+rkr5Z5LWDAHPAaK9GzzbIPP/CE+Wo1/8ClSz/ufzApn6zzhPe3vuz9qINc6MV6wn/6Yxaf702r1Yfl1kmeV6wfH/PsBRN6jcz2eMWQPeVaOldW/E+j4flEc/iQBzyTRXu5KT1TyAfgl3hANPK/5LpfUkg/AwQ5axYil/2D8dWjdzHZccUgzHvPX3i/cyziKa+82bHEbOxZ94HfMNcOM1k0t/+J+DzL3v5rlp/w13dwOCCO/nPZ7ARi2gb9gnk1Hx/DTs/QKH8+hLA4MbJDar5/MD5vc8P9/SoUlQAZYzjMkx9Kip7CB8Jfpq3IyqKHNTW8p3/FmtL3sXnzn/WlARhjF8yfN+UvevMW/2JflqftDdfU1JxYsHjqLJ70RfOfxe3BQR9Yo6mxnlgw/7n0J/5q+nz6osV/SNu3YrAQ0+1wTc07dScWLvjdovTnf+aH3qVLFy1Z8ptfp6WlPbNw4cKnn/nt75c8l76Udj/8H1/k4P/j+w/zAAAAAElFTkSuQmCC';
    Plugin = (function () {
        function Plugin(element, options) {
            this.settings = $.extend({}, $.fn.emapFilePhoto.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.settings);
        }

        return Plugin;
    })();

    _init = function (element, options) {

        if (options.token && options.token != "" && options.token != null) {
            options.defaultPhoto = options.contextPath + '/sys/emapcomponent/file/getFileByToken/' + options.token + '.do?date=' + new Date().getTime();
            options.scope = options.token.substring(0, options.token.length - 1);
            options.newToken = false;
        } else {
            options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
            options.token = options.scope + 1;
            options.newToken = true;
        }
        options.uploadUrl = options.contextPath + '/sys/emapcomponent/file/uploadTempFile/' + options.scope + '/' + options.token + '.do';


        $(element).addClass('bh-file-photo').append('<div class="bh-file-photo-block"></div>' +
            '<p class="bh-file-photo-info">' +
            '<span class="icon icon-spinner icon-pulse bh-file-photo-loading"></span>' +
            '<span class="bh-file-photo-error"></span>' +
            '<span class="bh-file-photo-success">上传成功</span>' +
            '</p>' +
            '<a class="bh-file-upload" href="javascript:void(0)"><input name="bhFile" type="file">上传</a>');

        _imgLoad((options.defaultPhoto ? options.defaultPhoto : defaultPhoto), function (img) {
            var w = img.width, h = img.height;
            if (w > h) {
                $(img).css({
                    'position': 'absolute',
                    'height': '88px',
                    'top': 0,
                    'left': '50%',
                    'margin-left': '-' + w / 2 / h * 88 + 'px'
                });
            } else {
                $(img).css({
                    'position': 'absolute',
                    'width': '88px',
                    'left': 0,
                    'top': '50%',
                    'margin-top': '-' + h / 2 / w * 88 + 'px'
                });
            }

            $(element).find('.bh-file-photo-block').html(img);
        });

        $(element).find('input[type=file][name=bhFile]').fileupload({
            url: options.uploadUrl,
            autoUpload: true,
            dataType: 'json',
            formData: {storeId: 'image'},
            submit: function (e, data) {
                var file = data.files[0];

                $(element).addClass('loading');
                // 文件的大小 和类型校验
                if (options.type && options.type.length > 0) {
                    if (!new RegExp(options.type.join('|').toUpperCase()).test(file.name.toUpperCase())) {
                        $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html('文件类型不正确');
                        return false;
                    }
                }

                if (fileReader && options.size) {
                    if (file.size / 1024 > options.size) {
                        $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html('文件大小超出限制');
                        return false;
                    }
                }

                if (options.submit) {
                    options.submit(e, data);
                }
            },
            done: function (e, data) {
                if (data.result.success) {



                    // 上传成功
                    $(element).removeClass('loading').addClass('success')
                    //.find('.bh-file-photo-block img').attr('src', data.result.tempFileUrl);
                    options.tempUrl = data.result.tempFileUrl;
                    options.fileUrl = data.result.fileUrl;

                    _imgLoad(data.result.tempFileUrl, function (img) {
                        var w = img.width, h = img.height;
                        if (w > h) {
                            $(img).css({
                                'position': 'absolute',
                                'height': '88px',
                                'top': 0,
                                'left': '50%',
                                'margin-left': '-' + w / 2 / h * 88 + 'px'
                            });
                        } else {
                            $(img).css({
                                'position': 'absolute',
                                'width': '88px',
                                'left': 0,
                                'top': '50%',
                                'margin-top': '-' + h / 2 / w * 88 + 'px'
                            });
                        }

                        $(element).find('.bh-file-photo-block').html(img);
                        if (options.done) {
                            options.done(e, data);
                        }
                    })

                } else {
                    // 上传失败
                    $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html((data.result.error ? data.result.error : '上传失败'));
                    if (options.fail) {
                        options.fail(e, data);
                    }
                }


            },
            fail: function (e, data) {
                $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html('上传失败');
                if (options.fail) {
                    options.fail(e, data);
                }
            }
        });

        options.attachmentParams = {
            storeId: "image",
            scope: options.scope,
            fileToken: options.token
        };
    };

    _imgLoad = function (url, cb) {
        var img = new Image();
        img.src = url;
        if (img.conplete) {
            cb(img.width, img.height);
        } else {
            img.onload = function () {
                cb(img);
                img.onload = null;
            }
        }
    };
    // 公共方法

    // 保存临时文件
    Plugin.prototype.saveTempFile = function () {
        var resultFlag = false, self = this;
        if (!this.settings.tempUrl || this.settings.tempUrl.length < 1) {
            return resultFlag;
        }
        $.ajax({
            type: "post",
            url: this.settings.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + this.settings.token + '.do',
            async: false,
            dataType: "json",
            success: function (data) {
            }
        });
        $.ajax({
            type: "post",
            async: false,
            url: this.settings.contextPath
            + "/sys/emapcomponent/file/saveAttachment/"
            + this.settings.scope + "/" + this.settings.token + ".do",
            data: {
                attachmentParam: JSON.stringify(this.settings.attachmentParams)
            },
            dataType: "json",
            success: function (data) {
                self.settings.tempFileSaved = true;
                resultFlag = data;
            }
        });
        return resultFlag;
    };
    // 获取文件地址
    Plugin.prototype.getFileToken = function () {
        if (this.settings.newToken && (!this.settings.tempUrl || this.settings.tempUrl.length == 0)) {
            return null;
        } else {
            return this.settings.token;
        }
    };

    // 销毁实例
    Plugin.prototype.destroy = function () {
        this.settings = null;
        $(this.$element).data('plugin', false).removeClass('success error loading').empty().attr('class', 'bh-file-photo');
    };


    // 插件
    $.fn.emapFilePhoto = function (options) {
        var instance;
        instance = this.data('plugin');

        if (!instance) {
            return this.each(function () {
                if (options == 'destroy') {
                    return this;
                }
                return $(this).data('plugin', new Plugin(this, options));
            });
        }

        if (options === true) return instance;

        if ($.type(options) === 'string') return instance[options]();
        return this;

    };

    $.fn.emapFilePhoto.defaults = {
        storeId: 'image',
        type: ['jpg', 'png', 'bmp'],
        size: 2048
    };

}).call(this);
/**
 *
 * @params rootPath
 * emap跟路径
 *
 * @params storeId
 * 上传文件的类型
 * String : file image
 *
 *
 * @params multiple
 * 是否支持多选(ie9) 不支持
 * Boolean  默认 false
 *
 * @params limit
 * 上传文件个数限制
 * Int
 *
 * @param type
 * 上传文件的类型限制
 * Array
 *
 * @param size
 * 上传文件的大小限制 KB
 * Int
 *
 * @params add
 * 选择文件的回调
 * func
 *
 * @params submit
 * 文件上传的回调
 * func
 *
 * @params done
 * 文件上传后的回调
 * func
 *
 * @params fail
 * 文件上传失败的回调
 * func
 *
 * @params formData
 * 附带参数
 * Object
 *
 */

// 文件上传
(function () {
    var fileReader = 'FileReader' in window;
    var _init, _getLimitInfo; //私有方法

    EmapFileUpload = (function () {
        // 实例化部分
        function EmapFileUpload(element, options) {
            var self = this;
            this.settings = $.extend({}, $.fn.emapFileUpload.defaults, options);
            this.$element = $(element);

            if (this.settings.token && this.settings.token != '') {
                this.settings.scope = this.settings.token.substring(0, this.settings.token.length - 1);
                this.settings.newToken = false;
            } else {
                this.settings.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
                this.settings.token = this.settings.scope + 1;
                this.settings.newToken = true;
            }

            _init(this.$element, this.settings);
            this.settings.uploadUrl = this.settings.contextPath + '/sys/emapcomponent/file/uploadTempFile/' + this.settings.scope + '/' + this.settings.token + '.do';
            fileInput.fileupload({
                url: self.settings.uploadUrl,
                autoUpload: true,
                multiple: self.settings.multiple,
                dataType: 'json',
                limitMultiFileUploads: 2,
                formData: {
                    size: self.settings.size,
                    type: self.settings.type,
                    storeId: self.settings.storeId
                },
                add: function (e, data) {
                    var files = data.files;
                    var tmp = new Date().getTime();
                    $(files).each(function (i) {
                        data.files[i].bhId = tmp + i;
                        self.settings.loadingCon.add(this.name, tmp + i);
                    });

                    if (self.settings.add) {
                        self.settings.add(e, data);
                    }
                    data.submit();

                },
                submit: function (e, data) {
                    var file = data.files[0];

                    // 文件数量限制的校验
                    if (self.settings.limit) {
                        var currentCount = self.settings.loadingCon.getFileNum() + self.settings.loadedCon.getFileNum();
                        if (currentCount > self.settings.limit) {
                            self.settings.loadingCon.error('文件数量超出限制', file.bhId);
                            return false;
                        }
                    }

                    // 文件的大小 和类型校验
                    if (self.settings.type && self.settings.type.length > 0) {
                        if (!new RegExp(self.settings.type.join('|').toUpperCase()).test(file.name.toUpperCase())) {
                            self.settings.loadingCon.error('文件类型不正确', file.bhId);
                            return false;
                        }
                    }

                    if (fileReader && self.settings.size) {
                        if (file.size / 1024 > self.settings.size) {
                            self.settings.loadingCon.error('文件大小超出限制', file.bhId);
                            return false;
                        }
                    }

                    self.settings.loadingCon._findFile(file.bhId).data('xhr', data);

                    if (self.settings.submit) {
                        self.settings.submit(e, data);
                    }
                },
                done: function (e, data) {
                    var file = data.files[0];
                    if (data.result.success) {
                        // 上传成功
                        self.settings.loadingCon.remove(file.bhId);
                        if (self.settings.storeId == 'image') {
                            self.settings.loadedCon.addImage(file.name, file.bhId, data.result.id, data.result.tempFileUrl, function (item) {
                                item.data('deleteurl', data.result.deleteUrl);
                            });
                        } else {
                            self.settings.loadedCon.add(file.name, file.bhId, data.result.id, data.result.tempFileUrl, function (item) {
                                item.data('deleteurl', data.result.deleteUrl);
                            });
                        }
                        if (self.settings.done) {
                            self.settings.done(e, data)
                        }
                    } else {
                        // 上传失败
                        self.settings.loadingCon.error((data.result.error ? data.result.error : '上传失败'), file.bhId);
                        if (self.settings.fail) {
                            self.settings.fail(e, data)
                        }
                    }


                },
                fail: function (e, data) {
                    var file = data.files[0];
                    self.settings.loadingCon.error('上传失败', file.bhId);
                    if (self.settings.fail) {
                        self.settings.fail(e, data)
                    }
                }
            });
        }

        // 公共方法
        EmapFileUpload.prototype.getFileToken = function () {
            return this.settings.token;
        };

        // 返回token下已有的正式文件的url数组
        EmapFileUpload.prototype.getFileUrl = function () {
            var options = this.settings;
            var fileArr;
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async : false,
                success: function (res) {
                    if (res.success) {
                        var fileHtml = '';
                        fileArr = $(res.items).map(function(){
                            return this.fileUrl;
                        }).get();
                    }
                }
            });

            return fileArr;
        };

        EmapFileUpload.prototype.saveTempFile = function () {
            // 删除 已经删除的正式文件
            var options = this.settings;
            var deleteArray = options.savedFileToDelete;
            $(deleteArray).each(function(){
                $.ajax({
                    type: "post",
                    url: options.contextPath + '/sys/emapcomponent/file/deleteFileByWid/' + this + '.do',
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            fileBlock.remove();
                        }
                    }
                });
            });

            if (this.settings.loadedCon.getFileNum() == 0) {
                return;
            }
            var resultFlag = false;
            $.ajax({
                type: "post",
                async: false,
                url: this.settings.contextPath
                + "/sys/emapcomponent/file/saveAttachment/"
                + this.settings.scope + "/" + this.settings.token + ".do",
                data: {
                    attachmentParam: JSON.stringify(this.settings.attachmentParams)
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        resultFlag = true;
                    }
                }
            });
            return resultFlag;
        };
        EmapFileUpload.prototype.destroy = function () {
            this.settings = null;
            $(this.$element).data('plugin', false).empty();
        };

        // 私有方法
        _init = function (element, options) {

            $(element).css('line-height', '28px').append('<a class="bh-file-upload" href="javascript:void(0)">' +
                '<input name="bhFile" type="file" ' + (options.multiple ? 'multiple' : '') + ' />上传' +
                '</a>' +
                '<span class="bh-text-caption bh-color-caption bh-mh-8 bh-file-upload-info">(' + _getLimitInfo(options) + ')</span>' +
                '<div class="bh-file-upload-loading-wrap bh-clearfix"></div>' +
                '<div class="bh-file-upload-loaded-wrap bh-clearfix"></div>' +
                '<input type="hidden" class="file-array" value="" />');

            fileInput = $(element).find('input[type=file]');
            options.savedFileToDelete = [];
            options.loadingCon = $(element).find('.bh-file-upload-loading-wrap').bhFileUploadingList({
                onDelete: function (item) {
                    if (item.hasClass('bh-error')) {
                        // 删除上传失败的文件
                        item.remove();
                    } else {
                        // 删除正在上传的文件
                        item.data('xhr').abort();
                        item.remove();
                    }
                }
            });
            options.loadedCon = $(element).find('.bh-file-upload-loaded-wrap').bhFileUploadedList({
                // 删除已上传文件
                onDelete: function (item) {
                    var fileBlock = $(item).closest('.bh-file-upload-file');

                    if (fileBlock.data('save')) {
                        // 删除正式文件
                        options.savedFileToDelete.push(fileBlock.data('fileid'));
                        fileBlock.remove();

                        //$.ajax({
                        //    type: "post",
                        //    url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do?WID=' + fileBlock.data('fileid'),
                        //    dataType: "json",
                        //    success: function (data) {
                        //        if (data.success) {
                        //            fileBlock.remove();
                        //        }
                        //    }
                        //});
                        //$.ajax({
                        //    type: "post",
                        //    url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '_1.do?WID=' + fileBlock.data('fileid'),
                        //    dataType: "json",
                        //    success: function (data) {}
                        //});
                        //$.ajax({
                        //    type: "post",
                        //    url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '_2.do?WID=' + fileBlock.data('fileid'),
                        //    dataType: "json",
                        //    success: function (data) {}
                        //});
                    } else {
                        // 删除临时文件
                        $.ajax({
                            type: "post",
                            url: fileBlock.data('deleteurl'),
                            dataType: "json",
                            data: {
                                attachmentParam: JSON.stringify({
                                    storeId: options.storeId,
                                    scope: options.scope,
                                    fileToken: options.token,
                                    items: [{
                                        id: fileBlock.data('fileid'),
                                        status: 'Delete'
                                    }]
                                })
                            },
                            success: function (data) {
                                if (data.success) {
                                    fileBlock.remove();
                                }
                            }
                        });
                    }

                }
            });

            // 获取token下已有的文件
            if (!options.newToken) {
                $.ajax({
                    type: "post",
                    url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                    dataType: "json",
                    success: function (res) {
                        if (res.success) {
                            if (options.storeId == 'image') {
                                $(res.items).each(function () {
                                    options.loadedCon.addImage(this.name, '', this.id, this.fileUrl, function (item) {
                                        item.data('save', true);
                                    });
                                });
                            } else {
                                $(res.items).each(function () {
                                    options.loadedCon.add(this.name, '', this.id, this.fileUrl, function (item) {
                                        item.data('save', true);
                                    });
                                });
                            }

                        }
                    }
                });
            }

            options.attachmentParams = {
                storeId: options.storeId,
                scope: options.scope,
                fileToken: options.token,
                params: options.params
            };
        };

        // 生成描述信息
        _getLimitInfo = function (options) {
            var infoHtml = '请上传附件';
            if (options.size) {
                infoHtml += ',文件最大为' + (options.size < 1024 ? options.size + 'K' : options.size / 1024 + 'M');
            }
            if (options.type && options.type.length > 0) {
                infoHtml += ',格式限制为' + options.type.join(",").toUpperCase();
            }
            return infoHtml;
        };


        // 定义插件
        $.fn.emapFileUpload = function (options) {
            var instance;
            instance = this.data('plugin');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function () {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('plugin', new EmapFileUpload(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        };

        // 插件的默认设置
        $.fn.emapFileUpload.defaults = {
            multiple: false,
            dataType: 'json',
            storeId: 'file',
            type: [],
            size: 0
        };


    })();

}).call(this);

// 上传中列表
$.fn.bhFileUploadingList = function (opt) {
    // 删除按钮的点击事件
    $(this).on("click", "a.bh-file-upload-delete", function () {
        if (opt.onDelete) {
            opt.onDelete($(this).closest('.bh-file-upload-file'));
        }
    });
    this.add = function (fileName, bhId, fileId) {
        $(this).append('<div class="bh-pull-left bh-file-upload-file" data-bhid="' + bhId + '" data-fileid="' + (fileId ? fileId : 0) + '">' +
            '<span class="bh-file-upload-filename" title="' + fileName + '">' + fileName + '</span>' +
            '<span class="bh-file-upload-error-msg"></span>' +
            '<i class="icon icon-spinner icon-pulse bh-file-uploading-icon"></i>' +
            '<a class="bh-file-upload-delete" href="javascript:void(0)">删除</a>' +
            '</div>');
    };

    this._findFile = function (bhId, fileId) {
        var id = fileId ? fileId : bhId;
        var selector = fileId ? 'fileid' : 'bhid';
        return $(this).find(".bh-file-upload-file[data-" + selector + "=" + id + "]");

    };

    this.error = function (errorMsg, bhId, fileId) {
        var block = this._findFile(bhId, fileId);
        if (block.length > 0) {
            block.addClass('bh-error').find('.bh-file-upload-error-msg').text(errorMsg);
        }
    };

    this.remove = function (bhId, fileId) {
        var block = this._findFile(bhId, fileId);
        if (block.length > 0) {
            block.remove();
        }
    };

    // 获取文件个数
    this.getFileNum = function () {
        return $(this).find(".bh-file-upload-file:not(.bh-error)").length;
    };

    return this;
};

//已上传列表
/**
 *
 * @param delete
 * 点击删除 的回调
 * func
 */
$.fn.bhFileUploadedList = function (opt) {
    //删除按钮的点击事件
    $(this).on("click", "a.bh-file-upload-delete", function () {
        if (opt.onDelete) {
            opt.onDelete($(this).closest('.bh-file-upload-file'));
        }
    });

    this.add = function (fileName, bhId, fileId, fileSrc, cb) {
        var item = $('<div class="bh-pull-left bh-file-upload-file" data-bhid="' + bhId + '" data-fileId="' + (fileId ? fileId : 0) + '">' +
            '<div class="bh-file-upload-file-icon bh-pull-left"><i class="iconfont icon-insertdrivefile"></i></div>' +
            '<div class="bh-file-upload-file-info bh-pull-left">' +
            '<a href="' + fileSrc + '" style="color:#333;"><span class="bh-file-upload-filename" title="' + fileName + '">' + fileName + '</span></a>' +
            '<p><span class="bh-file-upload-success-info">上传成功</span> <a class="bh-file-upload-delete" href="javascript:void(0)">删除</a></p>' +
            '</div>' +
            '</div>');
        $(this).append(item);
        if (cb) {
            cb(item);
        }
    };

    this.addImage = function (fileName, bhId, fileId, fileSrc, cb) {
        var item = $('<div class="bh-pull-left bh-file-upload-file bh-file-upload-img" data-bhid="' + bhId + '" data-fileId="' + (fileId ? fileId : 0) + '">' +
            '<div class="bh-file-upload-img-block"><span><img src="' + fileSrc + '" /></span></div>' +
            '<div class="bh-file-upload-file-info">' +
            '<span class="bh-file-upload-filename" title="' + fileName + '">' + fileName + '</span>' +
            '<p><span class="bh-file-upload-success-info">上传成功</span> <a class="bh-file-upload-delete" href="javascript:void(0)">删除</a></p>' +
            '</div>' +
            '</div>');
        $(this).append(item);
        if (cb) {
            cb(item)
        }
    };

    this._findFile = function (bhId, fileId) {
        var id = fileId ? fileId : bhId;
        var selector = fileId ? 'fileid' : 'bhid';
        return $(this).find(".bh-file-upload-file[data-" + selector + "=" + id + "]");

    };

    this.remove = function (bhId, fileId) {
        var block = this._findFile(bhId, fileId);
        if (block.length > 0) {
            block.remove();
        }
    };

    // 获取文件个数
    this.getFileNum = function () {
        return $(this).find(".bh-file-upload-file").length;
    };

    return this;
};



(function () {
    var Plugin,
        _render, _renderS, _renderNew, caseRender, _getItemModel, _renderFormWrap, _renderFormStructure,
        _renderReadonlyFormStructure, _renderEditFormStructure, _sortModel, _getAttr;  //插件的私有方法

    Plugin = (function () {

        function Plugin(element, options) {
            // 旧版 option 参数的兼容处理
            if (options.mode) {options.model = options.mode;}
            if (options.model == 'L' || options.model == 'horizontal') {options.model = 'h';}
            if (options.model == 'S' || options.model == 'vertical') {options.model = 'v';}
            if (options.rows) {options.cols = options.rows;}

            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.options = $.extend({}, $.fn.emapForm.defaults, options);
            if (!this.options || this.options == null || this.options == "") {
                this.options = WIS_EMAP_SERV.getContextPath();
            }
            //将dom jquery对象赋值给插件，方便后续调用da
            this.$element = $(element);

            if (options.readonly) {
                // _render(this.$element, this.options);
                _renderFormWrap(this.$element, this.options);
                return;
            }
            switch (this.options.model) {
                case "h":
                case "v":
                    // 单列可编辑表单 和  竖直表单
                    _renderFormWrap(this.$element, this.options);
                    // _renderNew(this.$element, this.options);
                    break;
                case "M":  // 兼容老版本  后面去除
                    // 多列只读表单
                    _render(this.$element, this.options);
                    break;
            }

            //初始化控件
            if (!this.options.readonly) {
                this.$element.emapFormInputInit(this.options);
                if (this.options.validate) {
                    this.$element.emapValidate({});
                }
            }



        }

        /**
         * 插件的公共方法，相当于接口函数，用于给外部调用
         */

        Plugin.prototype.disableItem = function (ids) {
            var self = this.$element;
            if ($.isArray(ids)) {
                $(ids).each(function () {
                    _disable(this)
                })
            } else {
                _disable(ids);
            }
            function _disable(id) {
                var item = $('[data-name=' + id + ']', self);
                switch (item.attr('xtype')) {
                    case 'text':
                    case 'textarea':
                        item.attr('disabled', true);
                        break;
                    case 'select':
                        item.jqxDropDownList({disabled: true});
                        break;
                    case 'date-local':
                        item.jqxDateTimeInput({disabled: true, formatString: "yyyy-MM-dd"});
                        break;
                    case 'date-ym':
                        item.jqxDateTimeInput({disabled: true, formatString: "yyyy-MM"});
                        break;
                    case 'tree':
                        item.emapDropdownTree('disable');
                        break;
                    case 'radiolist':
                        $('.repeateritem', item).jqxRadioButton('disable');
                        break;
                    case 'checkboxlist':
                        $('.repeateritem', item).jqxCheckBox('disable');
                        break;
                    case 'switcher' :
                        item.jqxSwitchButton('disable');
                        break;
                    case 'uploadfile':
                    case 'uploadphoto':
                    case 'uploadsingleimage':
                    case 'uploadmuiltimage':
                        $('input[type=file]', item).attr('disabled', true);
                        break;
                }
                item.closest('.bh-form-group').addClass('disabled');
            }
        };

        Plugin.prototype.enableItem = function (ids) {
            var self = this.$element;
            if ($.isArray(ids)) {
                $(ids).each(function () {
                    _enable(this)
                })
            } else {
                _enable(ids);
            }
            function _enable(id) {
                var item = $('[data-name=' + id + ']', self);
                switch (item.attr('xtype')) {
                    case 'text':
                        item.attr('disabled', false);
                        break;
                    case 'select':
                        item.jqxDropDownList({disabled: false});
                        break;
                    case 'date-local':
                    case 'date-ym':
                        item.jqxDateTimeInput({disabled: false});
                        break;
                    case 'tree':
                        item.emapDropdownTree('enable');
                        break;
                    case 'radiolist':
                        $('.repeateritem', item).jqxRadioButton('enable');
                        break;
                    case 'checkboxlist':
                        $('.repeateritem', item).jqxCheckBox('enable');
                        break;
                    case 'switcher' :
                        item.jqxSwitchButton('enable');
                        break;
                    case 'uploadfile':
                    case 'uploadphoto':
                    case 'uploadsingleimage':
                    case 'uploadmuiltimage':
                        $('input[type=file]', item).attr('disabled', false);
                        break;
                }
                item.closest('.bh-form-group').removeClass('disabled');
            }
        };

        Plugin.prototype.saveUpload = function () {
            var items = $('[xtype=uploadphoto], [xtype=uploadfile], [xtype=uploadsingleimage], [xtype=uploadmuiltimage]', this.$element);
            items.each(function () {
                switch ($(this).attr('xtype')) {
                    case 'uploadphoto':
                        $(this).emapFilePhoto('saveTempFile');
                        break;
                    case 'uploadfile':
                        $(this).emapFileUpload('saveTempFile');
                        break;
                    case 'uploadsingleimage':
                        $(this).emapSingleImageUpload('saveTempFile');
                        break;
                    case 'uploadmuiltimage':
                        $(this).emapImageUpload('saveTempFile');
                        break;
                }
            });
        };

        Plugin.prototype.showItem = function (ids) {
            var self = this.$element;
            if ($.isArray(ids)) {
                $(ids).each(function () {
                    _show(this)
                })
            } else {
                _show(ids);
            }
            function _show(id) {
                //$('[data-name=' + id + ']', self).closest('.bh-form-group').show();
                $('[data-name=' + id + ']', self).closest('.bh-row').show();
            }
        };

        Plugin.prototype.hideItem = function (ids) {
            var self = this.$element;
            if ($.isArray(ids)) {
                $(ids).each(function () {
                    _show(this)
                })
            } else {
                _show(ids);
            }
            function _show(id) {
                //$('[data-name=' + id + ']', self).closest('.bh-form-group').hide();
                $('[data-name=' + id + ']', self).closest('.bh-row').hide();
            }
        };

        Plugin.prototype.getValue = function () {
            var formData = {};
            this.$element.find('[xtype]').each(function () {

                switch ($(this).attr('xtype')) {
                    case 'radiolist':
                        formData[$(this).data('name')] = $(this).find('input[type=radio]:checked').map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'checkboxlist':
                        //formData[$(this).data('name')] = $(this).emapRepeater('getValue').val().join(",");
                        //formData[$(this).data('name')] = $(this).find('input[type=radio]:checked').val();
                        formData[$(this).data('name')] = $(this).find('input[type=checkbox]:checked').map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'tree' :
                        formData[$(this).data('name')] = $(this).emapDropdownTree('getValue');
                        break;
                    case 'uploadfile':
                        // 取值前 保存
                        formData[$(this).data('name')] = $(this).emapFileUpload('getFileToken');
                        break;
                    case 'uploadsingleimage':
                        formData[$(this).data('name')] = $(this).emapSingleImageUpload('getFileToken');
                        break;
                    case 'uploadmuiltimage':
                        formData[$(this).data('name')] = $(this).emapImageUpload('getFileToken');
                        break;
                    case 'uploadphoto':
                        formData[$(this).data('name')] = $(this).emapFilePhoto('getFileToken');
                        break;
                    case 'switcher':
                        formData[$(this).data('name')] = ($(this).val() ? 1 : 0);
                        break;
                    default :
                        formData[$(this).data('name')] = $(this).val();
                        break;
                }

            });
            return formData;
        };

        Plugin.prototype.setValue = function (val) {
            var options = this.options;
            if (this.options.readonly) {
                this.$element.find('[xtype]').each(function () {
                    var name = $(this).data('name');
                    var _this = $(this);
                    var dataAdapter;
                    if (val[name] !== undefined && val[name] !== "" && val[name] !== null) {
                        switch ($(this).attr('xtype')) {
                            case 'select':
                                _getItemModel(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function () {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    _this.html(nameArr.join(','));
                                });
                                break;
                            case 'radiolist':
                                _getItemModel(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    $(res).each(function () {
                                        if (this.id == val[name]) {
                                            _this.html(this.name);
                                            return false;
                                        }
                                    });
                                });
                                break;

                            case 'checkboxlist':
                                _getItemModel(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function () {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    _this.html(nameArr.join(','));
                                });
                                break;
                            case 'tree':
                                _getItemModel(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function () {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    _this.html(nameArr.join(','));
                                });
                                break;
                            case 'uploadfile':
                                $(this).emapFileDownload($.extend({}, {
                                    contextPath: options.root,
                                    token: val[name]
                                }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                                break;
                            case 'uploadsingleimage':
                            case 'uploadmuiltimage':
                                $(this).emapFileDownload($.extend({}, {
                                    model: 'image',
                                    contextPath: options.root,
                                    token: val[name]
                                }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                                break;
                            case 'uploadphoto':
                                $(this).emapFilePhoto('destroy');
                                $(this).emapFilePhoto($.extend({}, {
                                    token: val[name],
                                    contextPath: options.root
                                }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                                $('a', this).hide();
                                break;
                            default:
                                $(this).html(val[name]);
                        }
                    }
                });
            } else {
                this.$element.find('[xtype]').each(function () {
                    var name = $(this).data('name');
                    var _this = $(this);
                    //qiyu 2016-1-2 清空表单时，传入字段值为空，需要重置该控件
                    //if (val[name] !== undefined && val[name] !== "") {
                    if (val === undefined) {

                    } else if (val[name] !== undefined && val[name] !== null) {
                        switch ($(this).attr('xtype')) {

                            case 'select' :
                                if (typeof val[name] == "object") {
                                    $(this).jqxDropDownList('addItem', val[name][0])
                                    $(this).jqxDropDownList('checkAll');
                                } else {
                                    //qiyu 2016-1-2 判断为空时，清空所有选项
                                    if (val[name] == "") {
                                        $(this).jqxDropDownList('clearSelection');
                                    } else {
                                        $(this).val(val[name]);
                                    }

                                    //$(this).jqxDropDownList('addItem', val[name]);
                                }
                                break;
                            case 'radiolist' :
                                $('input[type=radio][value=' + val[name] + ']', _this).prop('checked', true);
                                break;
                            case 'checkboxlist' :
                                //$(this).emapRepeater('setValue', val[name]);
                                $(val[name].split(',')).each(function () {
                                    $('input[type=checkbox][value=' + this + ']', _this).prop('checked', true);
                                });

                                $(this).emapRepeater('setValue', val[name]);
                                break;
                            case 'switcher' :
                                $(this).jqxSwitchButton({checked: val[name]});
                                //$(this).val(val[name]);
                                break;
                            case "uploadfile":
                                $(this).emapFileUpload('destroy');
                                $(this).emapFileUpload($.extend({}, JSON.parse(decodeURI($(this).data('jsonparam'))), {
                                    contextPath: options.root,
                                    token: val[name]
                                }));
                                break;
                            case "uploadphoto":
                                $(this).emapFilePhoto('destroy');
                                $(this).emapFilePhoto($.extend({}, JSON.parse(decodeURI($(this).data('jsonparam'))), {
                                    contextPath: options.root,
                                    token: val[name]
                                }));
                                break;
                            case "uploadsingleimage":
                                $(this).emapSingleImageUpload('destroy');
                                $(this).emapSingleImageUpload($.extend({}, JSON.parse(decodeURI($(this).data('jsonparam'))), {
                                    contextPath: options.root,
                                    token: val[name]
                                }));
                                break;
                            case "uploadmuiltimage":
                                $(this).emapImageUpload('destroy');
                                $(this).emapImageUpload($.extend({}, JSON.parse(decodeURI($(this).data('jsonparam'))), {
                                    contextPath: options.root,
                                    token: val[name]
                                }));
                                break;
                            case 'tree':    //qiyu 2016-1-16
                                _getItemModel(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    $(res).each(function () {
                                        if (this.id == val[name]) {
                                            _this.emapDropdownTree("setValue", [this.id, this.name]);
                                            return false;
                                        }
                                    });
                                });
                                //$(this).emapDropdownTree("setValue", [ val[name], val[name + "_DISPLAY"] ]);
                                break;
                            //case "date-ym" :
                            //case "date-local" :
                            //
                            //    break;
                            default :
                                $(this).val(val[name]);
                        }
                    }
                });
            }
        };

        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };
        return Plugin;

    })();

    _renderNew = function (element, opt) {
        var self = element;
        var readOnly = opt.readonly ? opt.readonly : false;
        var groupName, hasGroup;

        var $form = $('<div class="bh-form-horizontal" bh-form-role="bhForm"></div>');
        if (opt.model == "v") {
            $form.addClass('bh-form-S').removeAttr('bh-form-role');
        }
        $(opt.data).each(function (i) {
            var _this = this;
            var rowHtml;

            var xtype = _this.get("xtype");
            var validFlag = "<div class='validFlag'><i class='md md-warning'></i></div>";
            var caption = _this.get("caption");
            var col = _this.get("col") ? _this.get("col") : 1;
            var url = _this.get("url");
            var name = _this.get("name");
            var hidden = _this.get("hidden") ? true : false;
            var placeholder = _this.get("placeholder") ? _this.get("placeholder") : "";
            var inputReadonly = _this.get("readonly") ? true : false;
            var required = _this.get("required") ? "bh-required" : "";
            var checkType = _this.get("checkType");
            var checkSize = _this.get("checkSize");
            var dataSize = _this.get("dataSize");
            var checkExp = _this.get("checkExp");
            var JSONParam = _this.get("JSONParam") ? _this.get("JSONParam") : {};
            var format = _this.get("format") ? _this.get("format") : 'yyyy-MM-dd';
            // 是否存在分组
            hasGroup = _this.get("groupName") ? true : false;

            // 渲染group信息
            if (hasGroup && groupName != _this.get("groupName")) {
                groupName = _this.get("groupName");
                $form.append('<div class="sc-title-borderLeft bh-mb-16" bh-role-form-outline="title">' + groupName + '</div><div class="bh-mb-24" bh-role-form-outline="container" style="margin-left:12px;"></div>'); //缩进12像素
            }

            var controlHtml = "";
            switch (xtype) {
                case undefined:
                case "text" :
                    xtype = "text";
                    controlHtml = '<input class="bh-form-control" data-name="{{name}}" name="{{name}}" xtype="{{xtype}}" type="{{xtype}}"' + (inputReadonly ? 'readOnly' : '') + ' maxlength="' + dataSize + '"  />';
                    break;
                case "textarea" :
                    controlHtml = '<textarea xtype="{{xtype}}" class="bh-form-control" rows="3" data-name="{{name}}" maxlength="' + dataSize + '" ' + (inputReadonly ? 'readOnly' : '') + ' ></textarea>';
                    break;
                case "selecttable" :
                    break;
                case "select" :
                case "tree" :
                case "date-local" :
                case "date-ym" :
                case "switcher" :
                case "uploadfile":
                case "uploadphoto":
                case "uploadsingleimage":
                case "uploadmuiltimage":
                case "buttonlist":
                case "multi-select" :
                    controlHtml = '<div xtype="{{xtype}}" data-name="{{name}}" {{url}} {{format}} {{JSONParam}} data-disabled={{inputReadonly}}></div>';
                    break;
                case "radiolist" :
                    controlHtml = '<div xtype="{{xtype}}" class="bh-radio jqx-radio-group" data-name="{{name}}" {{url}} data-disabled={{inputReadonly}}></div>';
                    break;
                case "checkboxlist" :
                    controlHtml = '<div xtype="{{xtype}}" class="bh-checkbox" data-name="{{name}}" {{url}} data-disabled={{inputReadonly}}></div>';
                    break;

            }

            controlHtml = controlHtml.replace(/\{\{xtype\}\}/g, xtype)
                .replace(/\{\{name\}\}/g, name)
                .replace(/\{\{inputReadonly\}\}/g, inputReadonly);
                controlHtml = controlHtml.replace(/\{\{url\}\}/g, url ? ('data-url="' + url + '"') : '');
                controlHtml = controlHtml.replace(/\{\{format\}\}/g, format ? ('data-format="' + format + '"') : '');
                controlHtml = controlHtml.replace(/\{\{JSONParam\}\}/g, JSONParam ? ('data-jsonparam="' + encodeURI(JSON.stringify(JSONParam)) + '"') : '');

            if (opt.model == 'h') {
                rowHtml = '<div class="bh-row" {{hidden}}  data-field=' + name + ' >' +
                    '<div class="bh-form-group bh-col-md-6 ' + required + '">' +
                    '<label class="bh-form-label bh-form-h-label bh-pull-left" title="' + caption + '">' + caption + '</label>' +
                    '<div class="bh-ph-8" style="margin-left: 115px;">' +
                    controlHtml +
                    '</div>' +
                    '</div>' +
                    '<div class="bh-form-group bh-col-md-3 bh-color-caption bh-form-placeholder">' + placeholder + '</div>' +
                    '</div>';
            } else if (opt.model == 'v') {
                rowHtml = '<div class="bh-row" {{hidden}} data-field=' + name + '>' +
                    '<div class="bh-form-group bh-col-md-12 ' + required + '">' +
                    '<label class="bh-form-label  ">' + caption + '</label>' +
                    '<div class="">' +
                    controlHtml +
                    '</div>' +
                    '</div>' +
                    '<div class="bh-form-group bh-col-md-12 bh-color-caption bh-form-placeholder">' + placeholder + '</div>' +
                    '</div>';
            }
            rowHtml = rowHtml.replace(/\{\{hidden\}\}/g, (hidden ? 'style="display: none;" hidden=true' : ''));
            if (hasGroup) {
                $('[bh-role-form-outline="container"]:last', $form).append(rowHtml);
            } else {
                $form.append(rowHtml).attr('bh-role-form-outline', 'container');
            }
        });
        $(self).append($form);
    };

    /**
     * 插件的私有方法
     */
    _render = function (element, opt) {

        //var ROOT = "";
        var self = element;
        var cols = opt.cols ? opt.cols : 3;
        var colWidth = 12 / cols;
        var formHtml = '';
        var readOnly = opt.readonly ? opt.readonly : false;
        var groupName, hasGroup;

        formHtml += '<form class="bh-form-horizontal fm-compact ' + (readOnly ? 'bh-form-readonly' : '') + '">';
        formHtml += '<div class="bh-row">';
        $(opt.data).each(function (i) {
            var _this = this;

            var xtype = _this.get("xtype");
            var validFlag = "<div class='validFlag'><i class='md md-warning'></i></div>";
            var caption = _this.get("caption");
            var col = _this.get("col") ? _this.get("col") : 1;
            var url = _this.get("url");
            var name = _this.get("name");
            var hidden = _this.get("hidden");
            var placeholder = _this.get("placeholder");
            var inputReadonly = _this.get("readonly") ? true : false;
            var required = _this.get("required");
            var checkType = _this.get("checkType");
            var checkSize = _this.get("checkSize");
            var dataSize = _this.get("dataSize");
            var checkExp = _this.get("checkExp");
            var JSONParam = _this.get("JSONParam") ? _this.get("JSONParam") : {};
            var format = _this.get("format") ? _this.get("format") : 'yyyy-MM-dd';
//            var value = rowValue[name];

            // 是否存在分组
            hasGroup = _this.get("groupName") ? true : false;


            // 渲染group信息
            if (groupName != _this.get("groupName")) {
                groupName = _this.get("groupName");
                if (i != 0) {
                    formHtml += '</div>'
                }
                if (groupName) {
                    formHtml += '<div class="bh-col-md-12 bh-form-groupname sc-title-borderLeft bh-mb-16" bh-role-form-outline="title" >' +
                        '' + groupName + '' +
                        '</div>';
                    formHtml += '<div class="bh-form-block bh-mb-16" bh-role-form-outline="container" style="margin-left: 12px;">';
                }
            }

            formHtml += '<div class="bh-form-group  bh-col-md-' + col * colWidth + ((required && !readOnly) ? ' bh-required' : '') + '" ' + (hidden ? 'style="display: none;"' : '') + ' >' +
                '<label class="bh-form-label bh-form-readonly-label" title="' + caption + '">' + caption + '</label>' +
                '<div class="bh-ph-8 bh-form-readonly-input">';


            if (readOnly) {
                switch (xtype) {
                    case "uploadfile":
                    case "uploadphoto":
                    case "uploadsingleimage":
                    case "uploadmuiltimage":
                        formHtml += '<div xtype="' + xtype + '" class="" data-name="' + name + '" data-JSONParam="' + encodeURI(JSON.stringify(JSONParam)) + '"></div>';
                        break;

                    case "textarea" :
                        formHtml += '<textarea xtype="textarea" data-name="' + name + '" class="bh-form-control" rows="3" maxlength="' + dataSize + '" readOnly placeholder="' + (placeholder ? placeholder : '') + '" style="background: #fff;resize: none;border: none!important;box-shadow: none!important;" ></textarea>';
                        break;
                    default :
                        formHtml += '<p data-name="' + name + '" data-url="' + url + '" xtype="' + xtype + '" class="bh-form-static"></p>';
                }
            } else {
                switch (xtype) {
                    case undefined:
                    case "text" :
                        formHtml += '<input class="bh-form-control" data-name="' + name + '" name="' + name + '" xtype="text" type="text"' + (inputReadonly ? 'readOnly' : '') + ' maxlength="' + dataSize + '" />';
                        //formHtml += '<input type="text" xtype="text" name="' + name + '" data-name="' + name + '" ' + (inputReadonly ? 'readOnly' : '') + ' maxlength="' + dataSize + '" />';
                        break;
                    case "textarea" :
                        formHtml += '<textarea xtype="textarea" class="bh-form-control" rows="3" data-name="' + name + '" maxlength="' + dataSize + '" ' + (inputReadonly ? 'readOnly' : '') + '  placeholder="' + (placeholder ? placeholder : '') + '"></textarea>';
                        break;
                    case "select" :
                        formHtml += '<div xtype="select" data-name="' + name + '" data-url="' + url + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "multi-select" :
                        break;
                    case "tree" :
                        formHtml += '<div xtype="tree" data-name="' + name + '" data-url="' + url + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "selecttable" :
                        break;
                    case "date-local" :
                        formHtml += '<div xtype="date-local" data-name="' + name + '" data-format="' + format + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "date-ym" :
                        formHtml += '<div xtype="date-ym" data-name="' + name + '" data-format="' + format + '"  data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "radiolist" :
                        formHtml += '<div xtype="radiolist" class="bh-radio jqx-radio-group" data-name="' + name + '" data-url="' + url + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "checkboxlist" :
                        formHtml += '<div xtype="checkboxlist" class="bh-checkbox" data-name="' + name + '" data-url="' + url + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "switcher" :
                        formHtml += '<div xtype="switcher" class="" data-name="' + name + '"></div>';
                        break;
                    case "uploadfile":
                        formHtml = '<div xtype="uploadfile" class="" data-name="' + name + '" data-JSONParam="' + encodeURI(JSON.stringify(JSONParam)) + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "uploadphoto":
                        formHtml = '<div xtype="uploadphoto" class="" data-name="' + name + '" data-JSONParam="' + encodeURI(JSON.stringify(JSONParam)) + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "uploadsingleimage":
                        formHtml = '<div xtype="uploadsingleimage" class="" data-name="' + name + '" data-JSONParam="' + encodeURI(JSON.stringify(JSONParam)) + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "uploadmuiltimage":
                        formHtml = '<div xtype="uploadmuiltimage" class="" data-name="' + name + '" data-JSONParam="' + encodeURI(JSON.stringify(JSONParam)) + '" data-disabled=' + inputReadonly + '></div>';
                        break;
                    case "buttonlist":
                        formHtml = '<div xtype="buttonlist" data-name="' + name + '" data-disabled=' + inputReadonly + ' data-url="' + url + '"></div>';
                        break;
                }
            }
            formHtml += '</div></div>';
        });
        formHtml += '</div>';
        formHtml += '</form>';
        var formEle = $(formHtml);
        $(self).append(formEle);

        // 若表单没有分组,则给表单加上上边框和右边框
        if (!hasGroup) {
            $('.bh-form-horizontal', self).addClass('bh-form-no-group');
        }
    };

    // 渲染表单外框
    _renderFormWrap = function (element, options) {
        var readOnly = options.readonly ? options.readonly : false;
        var $form = $('<div class="bh-form-horizontal" bh-form-role="bhForm" ></div>');
        if (readOnly) {
            $form.addClass('bh-form-readonly');
        } else {
            if (options.model == "v") {
                $form.addClass('bh-form-S').removeAttr('bh-form-role');
            }
        }

        var hasGroup = options.data.filter(function (val) {
            return !!val.groupName && val.groupName != "";
        });

        if (hasGroup.length > 0) {
            // 分组表单
            var sortedModel = _sortModel(options.data);
            for (var i = 0; i < sortedModel.length; i ++) {

                var groupContainer = $('<div bh-form-role=groupContainer>' +
                    '<div class="bh-col-md-12 bh-form-groupname sc-title-borderLeft bh-mb-16" bh-role-form-outline="title" title="' + sortedModel[i].groupName + '">' +
                    '' + sortedModel[i].groupName + '' +
                    '</div>' +
                    '<div class="bh-form-block bh-mb-16" bh-role-form-outline="container" style="margin-left: 12px;"></div>' +
                    '</div>');
                var formBlock = $('[bh-role-form-outline=container]', groupContainer);
                if (!sortedModel[i].groupName) {
                    // 隐藏未分组的字段
                    groupContainer.css('display', 'none');
                }
                if (readOnly) {
                    _renderReadonlyFormStructure(formBlock, sortedModel[i].items, options.cols);
                } else {
                    _renderEditFormStructure(formBlock, sortedModel[i].items, options.model);
                }
                $form.append(groupContainer);
            }
        } else {
            // 不分组表单
            if (readOnly) {
                _renderReadonlyFormStructure($form, options.data,options.cols);
            } else {
                _renderEditFormStructure($form, options.data, options.model);
            }
        }
        element.append($form);
    };

    // model 分组排序
    _sortModel = function (model) {
        var result = [];
        for (var i = 0; i < model.length; i ++) {
            var groupItem = result.filter(function (val) {
                return val.groupName == model[i].groupName;
            });
            if (groupItem.length == 0) {
                result.push({
                    "groupName" : model[i].groupName,
                    "items" : [model[i]]
                });
            } else {
                groupItem[0].items.push(model[i]);
            }
        }
        return result;
    };

    // 渲染只读表单结构
    _renderReadonlyFormStructure = function (form, data, cols) {
        cols = cols ? cols : 3;
        var colWidth = 12 / cols;
        var itemHtml = '';

        $(data).each(function () {
            var attr = _getAttr(this);

            itemHtml += '<div class="bh-form-group  bh-col-md-' + attr.col * colWidth + '" ' + (attr.hidden ? 'style="display: none;"' : '') + ' >' +
                '<label class="bh-form-label bh-form-readonly-label" title="' + attr.caption + '">' + attr.caption + '</label>' +
                '<div class="bh-ph-8 bh-form-readonly-input">';
            switch (attr.xtype) {
                case "uploadfile":
                case "uploadphoto":
                case "uploadsingleimage":
                case "uploadmuiltimage":
                    itemHtml += '<div xtype="' + attr.xtype + '" class="" data-name="' + attr.name + '" data-JSONParam="' + encodeURI(JSON.stringify(attr.JSONParam)) + '"></div>';
                    break;

                case "textarea" :
                    itemHtml += '<textarea xtype="textarea" data-name="' + attr.name + '" class="bh-form-control" rows="3" maxlength="' + attr.dataSize + '" readOnly placeholder="' + (attr.placeholder ? attr.placeholder : '') + '" style="background: #fff;resize: none;border: none!important;box-shadow: none!important;" ></textarea>';
                    break;
                default :
                    itemHtml += '<p data-name="' + attr.name + '" data-url="' + attr.url + '" xtype="' + attr.xtype + '" class="bh-form-static"></p>';
            }
            itemHtml += '</div></div>';
        });
        form.append(itemHtml).addClass('bh-form-block');
    };

    // 渲染编辑表单结构
    _renderEditFormStructure = function (form, data, model) {
        $(data).each(function () {
            var attr = _getAttr(this);
            var rowHtml = "";
            var controlHtml = "";
            switch (attr.xtype) {
                case undefined:
                case "text" :
                    attr.xtype = "text";
                    controlHtml = '<input class="bh-form-control" data-name="{{name}}" name="{{name}}" xtype="{{xtype}}" type="{{xtype}}" {{checkType}}  {{dataSize}} {{checkSize}} ' + (attr.inputReadonly ? 'readOnly' : '') + '  />';
                    break;
                case "textarea" :
                    controlHtml = '<textarea xtype="{{xtype}}" class="bh-form-control" rows="3" data-name="{{name}}" {{checkType}} {{dataSize}} {{checkSize}} ' + (attr.inputReadonly ? 'readOnly' : '') + ' ></textarea>';
                    break;
                case "selecttable" :
                    break;
                case "select" :
                case "tree" :
                case "date-local" :
                case "date-ym" :
                case "switcher" :
                case "uploadfile":
                case "uploadphoto":
                case "uploadsingleimage":
                case "uploadmuiltimage":
                case "buttonlist":
                case "multi-select" :
                    controlHtml = '<div xtype="{{xtype}}" data-name="{{name}}" {{url}} {{format}} {{checkType}} {{JSONParam}} data-disabled={{inputReadonly}}></div>';
                    break;
                case "radiolist" :
                    controlHtml = '<div xtype="{{xtype}}" class="bh-radio jqx-radio-group" data-name="{{name}}" {{url}} data-disabled={{inputReadonly}}></div>';
                    break;
                case "checkboxlist" :
                    controlHtml = '<div xtype="{{xtype}}" class="bh-checkbox" data-name="{{name}}" {{checkType}} {{url}} data-disabled={{inputReadonly}}></div>';
                    break;

            }
            controlHtml = controlHtml.replace(/\{\{xtype\}\}/g, attr.xtype)
                .replace(/\{\{name\}\}/g, attr.name)
                .replace(/\{\{inputReadonly\}\}/g, attr.inputReadonly);
            controlHtml = controlHtml.replace(/\{\{url\}\}/g, attr.url ? ('data-url="' + attr.url + '"') : '');
            controlHtml = controlHtml.replace(/\{\{format\}\}/g, attr.format ? ('data-format="' + attr.format + '"') : '');
            controlHtml = controlHtml.replace(/\{\{JSONParam\}\}/g, attr.JSONParam ? ('data-jsonparam="' + encodeURI(JSON.stringify(attr.JSONParam)) + '"') : '');
            controlHtml = controlHtml.replace(/\{\{checkType\}\}/g, attr.checkType ? ('data-checktype="' + encodeURI(JSON.stringify(attr.checkType)) + '"') : '');
            controlHtml = controlHtml.replace(/\{\{dataSize\}\}/g, attr.dataSize ? ('data-size="' + attr.dataSize + '"') : '');
            controlHtml = controlHtml.replace(/\{\{checkSize\}\}/g, attr.checkSize ? ('data-checksize="' + attr.checkSize + '"') : '');

            if (model == 'h') {
                rowHtml = '<div class="bh-row" {{hidden}}  data-field=' + attr.name + ' >' +
                    '<div class="bh-form-group bh-col-md-6 ' + attr.required + '">' +
                    '<label class="bh-form-label bh-form-h-label bh-pull-left" title="' + attr.caption + '">' + attr.caption + '</label>' +
                    '<div class="bh-ph-8" style="margin-left: 115px;">' +
                    controlHtml +
                    '</div>' +
                    '</div>' +
                    '<div class="bh-form-group bh-col-md-3 bh-color-caption bh-form-placeholder">' + attr.placeholder + '</div>' +
                    '</div>';
            } else if (model == 'v') {
                rowHtml = '<div class="bh-row" {{hidden}} data-field=' + attr.name + '>' +
                    '<div class="bh-form-group bh-col-md-12 ' + attr.required + '">' +
                    '<label class="bh-form-label  ">' + attr.caption + '</label>' +
                    '<div class="">' +
                    controlHtml +
                    '</div>' +
                    '</div>' +
                    '<div class="bh-form-group bh-col-md-12 bh-color-caption bh-form-placeholder">' + attr.placeholder + '</div>' +
                    '</div>';
            }
            rowHtml = rowHtml.replace(/\{\{hidden\}\}/g, (attr.hidden ? 'style="display: none;" hidden=true' : ''));
            form.append(rowHtml).attr('bh-role-form-outline', 'container');
        });
    };
    
    _getAttr = function (item) {
        return {
            xtype : item.get("xtype"),
            caption : item.get("caption"),
            col : item.get("col") ? item.get("col") : 1,
            url : item.get("url"),
            name : item.get("name"),
            hidden : item.get("hidden"),
            placeholder : item.get("placeholder") ? item.get("placeholder") : '',
            inputReadonly : item.get("readonly") ? true : false,
            required : item.get("required") ? "bh-required" : "",
            checkType :  item.get("checkType") ? item.get("checkType") : false,
            checkSize : item.get("checkSize"),
            dataSize : item.get("dataSize") ? item.get("dataSize") : 99999,
            checkExp : item.get("checkExp"),
            JSONParam : item.get("JSONParam") ? item.get("JSONParam") : {},
            format : item.get("format") ? item.get("format") : 'yyyy-MM-dd'
        }
    };
    
    _getItemModel = function (url, callback) {
        var dataAdapter = new $.jqx.dataAdapter({
            url: url,
            datatype: "json",
            async: false,
            root: "datas>code>rows"
        }, {
            loadComplete: function (records) {
                callback(records.datas.code.rows);
            }
        });
        dataAdapter.dataBind();
    };


    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapForm = function (options, params) {
        var instance;
        instance = this.data('plugin');
        /**
         *判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                if (options == 'destroy') {
                    return this;
                }
                return $(this).data('plugin', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.emapForm.defaults = {
        readonly: false, // 是否只读
        model: 'h', // 编辑表单样式  h  v
        size: 'M', // 表单尺寸
        cols: '3', // 只读表单 列数
        root: "", // emap根路径
        validate: true // 是否开启校验
    };
}).call(this);

$.fn.emapFormInputInit = function(opt){
    //控件初始化

    var options = $.extend({}, {
        'root': ''
    }, opt);


    var ROOT = options.root;
    $(this).find('[xtype]').each(function () {
        var _this = $(this);
        var dataAdapter;
        switch (_this.attr('xtype')) {
            case "textarea" :
                _this.jqxTextArea({width : '100%'});
                break;
            case "select" :
                dataAdapter = new $.jqx.dataAdapter({
                    url: _this.data("url"),
                    datatype: "json",
                    async : false,
                    //type: "get",
                    //type: "POST",
                    root : "datas>code>rows",
                    formatData:function(data){
                        if(_this.data('jsonparam')){
                            data = _this.data('jsonparam');
                        }
                        return data;
                    }
                },{
                    beforeLoadComplete: function(records){
                        //  添加置空选项
                        records.unshift({
                            id: '',
                            name: '请选择...',
                            uid: ''
                        });
                        return records;
                    }
                });
                _this.jqxDropDownList({
                    placeHolder : '请选择…',
                    source: dataAdapter,
                    displayMember: "name",
                    valueMember: "id",
                    filterable : true,
                    width : "100%",
                    filterPlaceHolder: "请查找",
                    //checkboxes : true,    //qiyu 2016-1-2 默认的下拉不要多选
                    disabled : _this.data('disabled') ? true : false
                });
                break;
            case "multi-select" :
                dataAdapter = new $.jqx.dataAdapter({
                    url: _this.data("url"),
                    datatype: "json",
                    async : false,
                    //type: "get",
                    //type: "POST",
                    root : "datas>code>rows",
                    formatData:function(data){
                        if(_this.data('jsonparam')){
                            data = _this.data('jsonparam');
                        }
                        return data;
                    }
                });
                _this.jqxComboBox({
                    placeHolder : '请选择…',
                    source: dataAdapter,
                    displayMember: "name",
                    multiSelect: true,
                    valueMember: "id",
                    width : "100%",
                    //checkboxes : true,    //qiyu 2016-1-2 默认的下拉不要多选
                    disabled : _this.data('disabled') ? true : false
                });
                break;
            case "date-ym" :
            case "date-local" :
                _this.jqxDateTimeInput({
                    width: "100%",
                    disabled: _this.data('disabled'),
                    value: null,
                    formatString: _this.data('format'),
                    culture: 'zh-CN'
                });
                break;
            case "radiolist" :

                /**
                 * 使用原生的控件实现
                 */
                if (_this.data('init')) {break;}
                dataAdapter = new $.jqx.dataAdapter({
                    url: _this.data("url"),
                    datatype: "json",
                    async : false,
                    root : "datas>code>rows"
                },{
                    loadComplete : function(records) {
                        var listHtml = '';
                        var random = '_' + parseInt(Math.random()*1000);
                        $(records.datas.code.rows).each(function(){
//                                    listHtml += '<div xtype=""></div>';
                            listHtml += '<label>' +
                                '<input type="radio" name="' + _this.data('name')  + '" value="' + this.id + '" />' +
                                '<i class="bh-choice-helper"></i>' + this.name +
                                '</label>';
                        });
                        _this.html(listHtml).data('init', true);
                    }
                });
                dataAdapter.dataBind();

                break;
            case "checkboxlist" :

                /**
                 * 使用原生的控件实现
                 */
                if (_this.data('init')) {break;}
                dataAdapter = new $.jqx.dataAdapter({
                    url: _this.data("url"),
                    datatype: "json",
                    async : false,
                    root : "datas>code>rows"
                },{
                    loadComplete : function(records) {
                        var listHtml = '';
                        var random = '_' + parseInt(Math.random()*1000);
                        $(records.datas.code.rows).each(function(){
//                                    listHtml += '<div xtype=""></div>';
                            listHtml += '<label>' +
                                '<input type="checkbox" name="' + _this.data('name') + '" value="' + this.id + '" />' +
                                '<i class="bh-choice-helper"></i>' + this.name +
                                '</label>';
                        });
                        _this.html(listHtml).data('init', true);
                    }
                });
                dataAdapter.dataBind();

                break;
            case "tree" :
                _this.emapDropdownTree({
                    url : _this.data('url'),
                    checkboxes : false
                });
                break;
            case "switcher" :
                _this.jqxSwitchButton({checked : true});
                _this.jqxSwitchButton('uncheck')
                break;
            //qiyu 2016-1-2 增加上传组件类型
            case "uploadfile":
                _this.emapFileUpload($.extend({},JSON.parse(decodeURI(_this.data('jsonparam'))),{contextPath: ROOT}));
                if (_this.data('disabled') == true) {
                    $('input[type=file]', _this).attr('disabled', true);
                }
                break;
            case "uploadphoto":
                _this.emapFilePhoto($.extend({},JSON.parse(decodeURI(_this.data('jsonparam'))),{contextPath: ROOT}));
                if (_this.data('disabled') == true) {
                    $('input[type=file]', _this).attr('disabled', true);
                }
                break;
            case "uploadsingleimage":
                _this.emapSingleImageUpload($.extend({},JSON.parse(decodeURI(_this.data('jsonparam'))),{contextPath: ROOT}));
                if (_this.data('disabled') == true) {
                    $('input[type=file]', _this).attr('disabled', true);
                }
                break;
            case "uploadmuiltimage":
                _this.emapImageUpload($.extend({},JSON.parse(decodeURI(_this.data('jsonparam'))),{contextPath: ROOT}));
                if (_this.data('disabled') == true) {
                    $('input[type=file]', _this).attr('disabled', true);
                }
                break;
            case "buttonlist":
                _this.bhButtonGroup({
                    url: _this.data('url')
                });
                break;
            default:
                _this.jqxInput({ width : '100%'});
                break;
        }
    });
};
//  多图上传
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var _init, _getLimitInfo, _refreshFileInput; //私有方法

    Plugin = (function () {
        // 实例化部分
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapImageUpload.defaults, options);
            this.$element = $(element);

            if (this.options.token && this.options.token != null && this.options.token != '') {
                this.options.token = this.options.token.toString();
                this.options.scope = this.options.token.substring(0, this.options.token.length - 1);
                this.options.newToken = false;
            } else {
                this.options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
                this.options.token = this.options.scope + 1;
                this.options.newToken = true;
            }

            _init(this.$element, this.options);

        }

        // 公共方法
        Plugin.prototype.getFileToken = function () {
            return this.options.token;
        };

        // 返回token下已有的正式文件的url数组
        Plugin.prototype.getFileUrl = function () {
            var options = this.options;
            var fileArr;
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async : false,
                success: function (res) {
                    if (res.success) {
                        var fileHtml = '';
                        fileArr = $(res.items).map(function(){
                            return this.fileUrl;
                        }).get();
                    }
                }
            });

            return fileArr;
        };

        Plugin.prototype.saveTempFile = function () {
            if ($('.bh-file-img-block', this.$element).length < 2) { return; }
            var resultFlag = false;
            $.ajax({
                type: "post",
                async: false,
                url: this.options.contextPath
                + "/sys/emapcomponent/file/saveAttachment/"
                + this.options.scope + "/" + this.options.token + ".do",
                data: {
                    attachmentParam: JSON.stringify(this.options.attachmentParams)
                },
                dataType: "json",
                success: function (data) {
                    resultFlag = data;
                }
            });
            return resultFlag;
        };
        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };

        // 私有方法
        _init = function (element, options) {
            var imgWidth = parseInt(options.width) - 6;
            var imgHeight = parseInt(options.height) - 6;

            $(element).addClass('bh-clearfix').append('<p class="bh-file-img-info"></p>' +
                '<div class="bh-file-img-container">' +
                '<div class="bh-file-img-input bh-file-img-block" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                '<span>' +
                '<span class="bh-file-img-plus">+</span>' +
                '<span class="bh-file-img-text">点击上传</span>' +
                '</span>' +
                '<input type="file" ' + (options.multiple ? 'multiple' : '') + '>' +
                '</div>' +
                '</div>');

            // 生成描述信息
            var introText = '请上传图片';
            if (options.type && options.type.length > 0) {
                introText += ', 支持' + options.type.join(',').toUpperCase() + '类型';
            }

            if(options.size && options.size > 0) {
                introText += ',大小在' + options.size + 'K以内';
            }

            if(options.limit && options.limit > 0) {
                introText += ',数量在' + options.limit + '以内';
            }


            $('.bh-file-img-info', element).html(introText);

            if (options.height <= 100) {
                $('.bh-file-img-text', element).hide();
            }


            // 获取token下已有的文件
            if (!options.newToken) {
                $.ajax({
                    type: "post",
                    url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                    dataType: "json",
                    success: function (res) {
                        if (res.success) {
                            console.log(res)
                            var itemHtml = '';
                            $(res.items).each(function(){
                                itemHtml += '<div class="bh-file-img-block saved" data-fileid="' + this.id + '" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                                    '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                                    '<div class="bh-file-img-fail"></div>' +
                                    '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                                    '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                                    '<img src="' + this.fileUrl + '" style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                                    '</span>' +
                                    '</div>' +
                                    '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                                    '</div>';
                            });
                            $('.bh-file-img-input', element).before(itemHtml);
                        }
                    }
                });
            }

            options.attachmentParams = {
                storeId: options.storeId,
                scope: options.scope,
                fileToken: options.token,
                params: options.params
            };

            options.uploadUrl = options.contextPath + '/sys/emapcomponent/file/uploadTempFile/' + options.scope + '/' + options.token + '.do';

            // 上传input 初始化
            $(element).find('input[type=file]').fileupload({
                url: options.uploadUrl,
                autoUpload: true,
                multiple: options.multiple,
                dataType: 'json',
                limitMultiFileUploads: 1,
                formData: {
                    size: options.size,
                    type: options.type,
                    storeId: options.storeId
                },
                add: function (e, data) {
                    var files = data.files;
                    var tmp = new Date().getTime();

                    $(files).each(function (i) {
                        data.files[i].bhId = tmp + i;

                        $('.bh-file-img-input', element).before('<div class="bh-file-img-block loading" data-bhid="' + data.files[i].bhId + '" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                            '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                            '<div class="bh-file-img-fail"></div>' +
                            '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                            '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                            '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                            '</span>' +
                            '</div>' +
                            '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                            '</div>');
                    });

                    if (options.add) {
                        options.add(e, data);
                    }
                    data.submit();

                },
                submit: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);

                    // 文件数量限制的校验
                    if (options.limit) {
                        var currentCount = $('.bh-file-img-block', element).length - 1;
                        if (currentCount > options.limit) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件数量超出限制');
                            return false;
                        }
                    }

                    // 文件的大小 和类型校验
                    if (options.type && options.type.length > 0) {
                        if (!new RegExp(options.type.join('|').toUpperCase()).test(file.name.toUpperCase())) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件类型不正确');
                            return false;
                        }
                    }

                    if (fileReader && options.size) {
                        if (file.size / 1024 > options.size) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件大小超出限制');
                            return false;
                        }
                    }
                    imgBlock.data('xhr', data);

                    if (options.submit) {
                        options.submit(e, data);
                    }
                },
                done: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);

                    if (data.result.success) {
                        // 上传成功
                        imgBlock.removeClass('loading').addClass('success');

                        $('img', imgBlock).attr('src', data.result.tempFileUrl);
                        imgBlock.data({
                            'fileid' : data.result.id,
                            'deleteurl' : data.result.deleteUrl
                        });

                    } else {
                        // 上传失败
                        imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html(data.result.error ? data.result.error : '上传失败');
                    }

                    if (options.done) {
                        options.done(e, data)
                    }
                },
                fail: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);
                    imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('上传失败');
                    if (options.fail) {
                        options.fail(e, data)
                    }
                }
            });

            // 删除事件绑定
            $(element).on('click', '.bh-file-img-delete', function(){
                var imgBlock = $(this).closest('.bh-file-img-block');
                if (imgBlock.hasClass('success')) {
                    // 删除临时文件
                    $.ajax({
                        type: "post",
                        url: imgBlock.data('deleteurl'),
                        dataType: "json",
                        data: {
                            attachmentParam: JSON.stringify({
                                storeId: options.storeId,
                                scope: options.scope,
                                fileToken: options.token,
                                items: [{
                                    id: imgBlock.data('fileid'),
                                    status: 'Delete'
                                }]
                            })
                        },
                        success: function (data) {
                            if (data.success) {
                                imgBlock.remove();
                            }
                        }
                    });
                } else if(imgBlock.hasClass('error')) {
                    // 错误文件直接删除
                    imgBlock.remove();
                } else if(imgBlock.hasClass('loading')) {
                    //  删除正在上传的文件
                    imgBlock.data('xhr').abort();
                    itimgBlockem.remove();
                } else if(imgBlock.hasClass('saved')){
                    // 删除正式文件
                    deleteSavedFile();
                }

                function deleteSavedFile () {
                    $.ajax({
                        type: "post",
                        url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do?WID=' + imgBlock.data('fileid'),
                        dataType: "json",
                        success: function (data) {
                            if (data.success) {
                                imgBlock.remove();
                            }
                        }
                    });
                    $.ajax({
                        type: "post",
                        url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do?WID=' + imgBlock.data('fileid') + '_1',
                        dataType: "json",
                        success: function (data) {}
                    });
                    $.ajax({
                        type: "post",
                        url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do?WID=' + imgBlock.data('fileid') + '_2',
                        dataType: "json",
                        success: function (data) {}
                    });
                }
            });
        };

        // 刷新上传控件的显示或隐藏
        _refreshFileInput = function(element, options) {
            var currentCount = $('.bh-file-img-block', element).length - 1;
            var fileInput = $('.bh-file-img-input', element);
            if (currentCount >= options.limit) {
                // 数量达到上限 上传控件隐藏
                fileInput.hide();
            } else {
                // 数量未达到上限 上传控件显示
                fileInput.show();
            }
        };

        // 定义插件
        $.fn.emapImageUpload = function (options, params) {
            var instance;
            instance = this.data('plugin');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function () {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('plugin', new Plugin(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options](params);
            }
        };

        // 插件的默认设置
        $.fn.emapImageUpload.defaults = {
            multiple: false,
            dataType: 'json',
            storeId: 'image',
            width: 200,
            height: 150,
            type: ['jpg', 'png', 'bmp'],
            size: 0
        };


    })();

}).call(this);
/**
 * opt
 *
 * app
 * module
 * page
 * action
 * preCallback
 * importCallback
 * closeCallback
 * autoClose
 * tplUrl
 *
 */

$.emapImport = function(opt) {
    opt.content = '<div class="bh-import-content">' +
        '<div class="bh-import-step active">' +
        '<h5 class="bh-import-step-title">' +
        '<span>1</span>' +
        '上传文件' +
        '</h5>' +

        '<div class="bh-import-step-content bh-import-step1-content">' +
        '<a href="javascript:void(0)" class="bh-btn bh-btn-primary bh-import-input-a">' +
        '开始上传' +
        '<input type="file" role="fileInput"/>' +
        '</a>' +

        '<p class="bh-color-caption bh-import-p bh-import-step1-intro">如果您是初次使用，建议您<a role="downTplBtn" href="javascript:void(0)">下载导入模板</a>进行查看。' +
        '</p>' +
        '</div>' +
        '<div class="bh-import-step-content bh-import-step1-content" style="display: none;">' +
        '<a href="javascript:void(0)" role="importConfirmBtn" class="bh-btn bh-btn-primary bh-pull-right">' +
        '确认上传' +
        '</a>' +
        '<a href="javascript:void(0)" class="bh-pull-right bh-import-reload-a" role="reImportBtn">重新上传</a>' +

        '<p class="bh-color-caption bh-import-p  bh-import-step1-file">' +
        '<span class="bh-import-file-name">2015级教职工统计表.docx</span>' +
        '<span class="bh-import-file-size"></span>' +
        '</p>' +

        '</div>' +
        '</div>' +
        '<div class="bh-import-step ">' +
        '<h5 class="bh-import-step-title">' +
        '<span>2</span>' +
        '导入数据' +
        '</h5>' +

        '<div class="bh-import-step-content">' +
        '<p class="bh-import-step2-intro">等待文件上传完毕后自动导入数据</p>' +

        '<div class="bh-import-step2-content">' +
        '<div class="bh-import-loading-bar">' +
        '<div></div>' +
        '</div>' +
        '<p class="bh-import-step2-count"></p>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="bh-import-step ">' +
        '<h5 class="bh-import-step-title">' +
        '<span>3</span>' +
        '完成' +
        '</h5>' +

        '<div class="bh-import-step-content bh-import-step3-content">' +
        '<button role="closeConfirmBtn" class="bh-btn bh-btn-primary bh-pull-right">确定关闭</button>' +
        '<p class="bh-import-result-detail">该文件全部导入数据10000条，其中失败导入2条</p>' +
        '<p>具体结果可查看<a class="bh-import-export" href="javascript:void(0)">下载导入结果</a>查看明细。</p>' +
        '</div>' +
        '</div>' +
        '</div>';



    // var fileLayer = layer.open({
    //     type: 1,
    //     title: '导入数据',
    //     closeBtn: 1, //不显示关闭按钮
    //     area: ['480px', '380px'],
    //     shift: 2,
    //     shadeClose: false, //开启遮罩关闭
    //     content: opt.content,
    //     success: function(layer, index) {
    //         if (opt.preCallback && opt.preCallback != "") {
    //             opt.preCallback();
    //         }
    //         opt.layer = index;
    //         $("#fileInput").emapImportData(opt);
    //     },
    //     cancel: function() {
    //         if ($("#daoru").data("loading")) {
    //             var fileConfirm = layer.confirm('数据正在传输中，关闭窗口将丢失，确认关闭吗？',
    //                 function() {
    //                     layer.close(fileLayer);
    //                     layer.close(fileConfirm);
    //                 }
    //             );
    //             return false;
    //         }
    //     }
    // });

    BH_UTILS.bhWindow(opt.content, '导入数据', {}, {});
    if (opt.preCallback && opt.preCallback != "") {
        opt.preCallback();
    }
    $("[role=fileInput]").emapImportData(opt);
};

/**
 * opt
 *
 * app
 * module
 * page
 * action
 * importCallback
 * closeCallback
 *
 */

$.fn.emapImportData = function(opt) {
    // 下载导入模板参数
    var $element = $(this).closest('.bh-import-content');
    var downTplData = {
        "app": opt.app, // *
        "module": opt.module, // *
        "page": opt.page, // *
        "action": opt.action, // *
        "storeId": opt.storeId ? opt.storeId : 'imexport'
    };
    var contextPath = opt.contextPath;
    var scope, token;

    if (opt.params) {
        $.extend(downTplData, opt.params);
    }
    scope = Date.parse(new Date());
    token = scope + 1;
    $(this).fileupload({
        autoUpload: false, //是否自动上传
        url: contextPath + '/sys/emapcomponent/file/uploadTempFile/' + scope + '/' + token + '.do', //上传地址
        dataType: 'json',
        formData: {
            storeId: (opt.storeId ? opt.storeId : 'file')
        },
        add: function(e, data) {

            var file = data.files;
            var step1Contents = $(this).closest(".bh-import-step").find(".bh-import-step-content");
            if (e.target.files) {
                step1Contents.eq(1).find("span.bh-import-file-name").text(file[0].name).attr("title", file[0].name);
                step1Contents.eq(1).find("span.bh-import-file-size").text("(" + file[0].size / 1024 + "k)");
            }
            step1Contents.eq(0).hide();
            step1Contents.eq(1).show();
            $("[role=importConfirmBtn]", $element).unbind("click").bind("click", function() {
                $("[role=fileInput]", $element).data("loading", true);
                var stepContent = $(this).closest(".bh-import-step-content");
                stepContent.children("a").hide();
                stepContent.prepend('<div class="bh-import-step1-loading-block bh-pull-right"><div class="sk-spinner sk-spinner-fading-circle bh-pull-right" style="height: 28px; width: 28px;">' +
                    '<div class="sk-circle1 sk-circle"></div>' +
                    '<div class="sk-circle2 sk-circle"></div>' +
                    '<div class="sk-circle3 sk-circle"></div>' +
                    '<div class="sk-circle4 sk-circle"></div>' +
                    '<div class="sk-circle5 sk-circle"></div>' +
                    '<div class="sk-circle6 sk-circle"></div>' +
                    '<div class="sk-circle7 sk-circle"></div>' +
                    '<div class="sk-circle8 sk-circle"></div>' +
                    '<div class="sk-circle9 sk-circle"></div>' +
                    '<div class="sk-circle10 sk-circle"></div>' +
                    '<div class="sk-circle11 sk-circle"></div>' +
                    '<div class="sk-circle12 sk-circle"></div>' +
                    '</div>' +
                    '<p class="bh-pull-right" style="margin-right: 12px;line-height:28px;">上传中……</p></div>');
                data.submit();
            });
        },
        done: function(e, data) { //设置文件上传完毕事件的回调函数
            if (data.result.success) {
                var mid = data.result.id;
                downTplData.attachment = data.result.id;
                $.ajax({
                    type: "post",
                    url: contextPath + '/sys/emapcomponent/file/saveAttachment/' + scope + '/' + token + '.do',
                    data: {
                        attachmentParam: JSON.stringify({
                            scope: scope,
                            fileToken: token,
                            attachmentParam: {
                                storeId: downTplData.storeId
                            }
                        })
                    },
                    success: function(json) {
                        $.ajax({
                            type: "post",
                            url: contextPath + '/sys/emapcomponent/imexport/importRownum.do',
                            data: $.extend(downTplData, {
                                "app": downTplData.app,
                                "attachment": mid
                            }),
                            success: function(json) {
                                $(".bh-import-step2-count", $element).html('本次共导入数据' + JSON.parse(json).rowNumber + '条');
                                $(".bh-import-step1-content", $element).find("div.bh-import-step1-loading-block").remove();
                                $("div.bh-import-step:eq(1)", $element).addClass("active");
                                $(".bh-import-loading-bar div", $element).animate({
                                    "width": "87%"
                                }, 3000);
                                $.ajax({
                                    type: "post",
                                    url: contextPath + '/sys/emapcomponent/imexport/import.do',
                                    data: downTplData,
                                    success: function(json) {
                                        var json = JSON.parse(json);
                                        if (json.status == 1) {
                                            $(".bh-import-loading-bar div", $element).stop().animate({
                                                "width": "100%"
                                            }, 500, function() {
                                                if (opt.importCallback && opt.importCallback != "") {
                                                    var data = $.extend({
                                                        "total": json.total,
                                                        "success": json.success,
                                                        "callback": null
                                                    }, opt.importCallback(json.total, json.success));
                                                    importSuccess(data.total, data.success, data.callback);

                                                } else {
                                                    importSuccess(json.total, json.success, function(a) {
                                                        //a.attr("href", contextPath + "/sys/emapcomponent/file/getAttachmentFile/" + json.attachment + ".do");
                                                    });
                                                }
                                                $("div.bh-import-step:eq(2)", $element).find(".bh-import-export").attr("href", contextPath + "/sys/emapcomponent/file/getAttachmentFile/" + json.attachment + ".do");
                                                if (opt.autoClose == true) {
                                                    BH_UTILS.bhWindow.close();
                                                }
                                            });
                                        } else {
                                            $("[role=fileInput]", $element).data("loading", false);
                                            $("div.bh-import-step-content:eq(2)", $element).html('<p></p>');
                                            $("div.bh-import-step:eq(2)", $element).addClass("active").find(".bh-import-result-detail").html('<span style="color: red">导入失败</span>');
                                        }
                                    }
                                });
                            },
                            error: function(e) {}
                        });
                    }
                });
            }
        }
    });
    // 点击重新上传
    $("[role=reImportBtn]", $element).on("click", function() {
        $("[role=fileInput]", $element).click();
    });

    // 点击确定关闭
    $("[role=closeConfirmBtn]", $element).on("click", function() {
        if (opt.closeCallback && opt.closeCallback != "") {
            opt.closeCallback();
        }
        BH_UTILS.bhWindow.close();
    });

    // 点击下载模板
    $("[role=downTplBtn]", $element).on("click", function() {
        if (opt.tplUrl && opt.Url != "") {
            location.href = opt.tplUrl;
        } else {
            $.ajax({
                type: "post",
                url: contextPath + '/sys/emapcomponent/imexport/importTemplate.do',
                data: downTplData,
                success: function(json) {
                    location.href = (contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + JSON.parse(json).attachment + '.do');
                },
                error: function(e) {
                    console.log(e)
                }
            });
        }

    });

    function importSuccess(totalNum, successNum, callback) {
        $("[role=fileInput]", $element).data("loading", false);
        $("div.bh-import-step-content:eq(2)", $element).html('<p>数据导入完成</p>');
        $("div.bh-import-step:eq(2)", $element).addClass("active").find(".bh-import-result-detail").html("该文件全部导入数据" + totalNum + "条，其中失败导入" + (totalNum - successNum) + "条");
        if (callback && callback != "") {
            callback($("div.bh-import-step:eq(2)", $element).find(".bh-import-export"));
        }
    }
};

/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function () {
    /**
     * 定义一个插件
     */
    var Plugin,
        _render;  //插件的私有方法

    /**
     * 这里是一个自运行的单例模式。
     *
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.emapRepeater.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            _render(this.$element, this.settings);
        }

        /**
         * 插件的公共方法，相当于接口函数，用于给外部调用
         */
        Plugin.prototype.getValue = function () {
            /**
             * 方法内容
             */
            var returnValue = [];
            $(this.$element).find(".repeateritem").each(function(){
                var v = $(this).data("value");
                if(v !== undefined)
                  returnValue.push($(this).data("value"));
            });
            this.$element.val(returnValue);
        };

        Plugin.prototype.setValue = function (valueArray) {
            /**
             * 方法内容
             */
            //this.$element.val(valueArray);
            $(this.$element).find(".repeateritem").each(function(){
                //var v = $(this).data("value");
                $(this).trigger("setValue", [valueArray]);
            });

        };

        return Plugin;

    })();

    /**
     * 插件的私有方法
     */
    _render = function (element, options) {
        var $element = element;
        var source =
        {
            datatype: "json",
            root:"datas>code>rows",
            datafields: [
                { name: 'id' },
                { name: 'name' }
            ],
            id: 'id',
            url: options.url,
            data: options.params
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function () {
                var records = dataAdapter.records;
                for (var i = 0; i < records.length; i++) {
                    var item = records[i];
                    var itemDOM = $("<div class='repeateritem'></div>");
                    if(options.align == "horizontal")itemDOM.css({"float":"left"});
                    options.render(itemDOM, item);
                    $element.append(itemDOM);
                }
            }
        });
        dataAdapter.dataBind();
    };

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapRepeater = function (options, params) {
        var instance;
        instance = this.data('emapRepeater');
        /**
         *判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('emapRepeater', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') instance[options](params);
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.emapRepeater.defaults = {
        align: "vertical",
        itemWidth: '50%'
    };
}).call(this);

'use strict';
(function () {
    //定义html和css
    var conditionTpl = '<div class="bh-ph-8 bh-row ers-fix-row" style="position: relative; padding:0; margin-bottom: 8px;">' +
        '<div class="bh-col-md-4" style="position: relative; padding-left: 0;">' +
        '<select class="bh-form-control ers-nice-select ers-j-condition-key">' +
        _genConditionKey() +
        '</select>' +
        '<i class="iconfont icon-arrowdropdown ers-nice-select-arrow"></i>' +
        '</div>' +
        '<div class="bh-col-md-4" style="position: relative;padding-left: 0;">' +
        '<select class="bh-form-control ers-nice-select ers-j-condition-logic">' +
        _genConditionLogic() +
        '</select>' +
        '<i class="iconfont icon-arrowdropdown ers-nice-select-arrow"></i>' +
        '</div><div class="bh-col-md-4" style="position: relative; padding-left: 0;padding-right: 0;">' +
        '<select class="bh-form-control ers-nice-select ers-j-condition-value">' +
        _genConditionValue() +
        '</select>' +
        '<i class="iconfont icon-arrowdropdown ers-nice-select-arrow" style="right: 0"></i>' +
        '</div>' +
        '<i class="iconfont icon-close ers-close ers-j-del-btn"></i>' +
        '</div>';

    var tpl = '<div class="bh-pull-left" style="width: calc(100% - 80px); margin-left: 8px;">' +
        '<div class="ers-j-condition"></div>' +
        '<div class="ers-add bh-ph-8 ers-j-add-btn">' +
        '<i class="iconfont icon-addcircle"></i>' +
        '<span>添加条件</span>' +
        '</div>' +
        '</div>';

    var Plugin;

    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapdatatable.defaults, options);
            this.$element = $(element);
            _create(this);
        }
        return Plugin;
    })();

    Plugin.prototype.getAll = function () {

    };

    Plugin.prototype.getOne = function (key) {

    };

    Plugin.prototype.setAll = function () {

    };

    Plugin.prototype.setOne = function (key, value) {

    };

    Plugin.prototype.clear = function () {

    };

    Plugin.prototype.destroy = function () {

    };

    function _genConditionKey() {
        return '<option value="1">1</option>' +
            '<option value="2">2</option>' +
            '<option value="3">3</option>' +
            '<option value="4">4</option>';
    }

    function _genConditionLogic() {
        return '<option value="1">大于</option>' +
            '<option value="2">小于</option>' +
            '<option value="3">等于</option>' +
            '<option value="4">包含</option>';
    }

    function _genConditionValue() {
        return '<option value="1">1</option>' +
            '<option value="2">2</option>' +
            '<option value="3">3</option>' +
            '<option value="4">4</option>';
    }

    //生成dom
    function _create(instance) {
        instance.$element.html(tpl);
        _eventListener(instance);
    }

    //删除条件
    function _deleteCondition() {
        $('.ers-j-rule-setting').off('click', '.ers-j-del-btn').on('click', '.ers-j-del-btn', function () {
            var $this = $(this);
            BH_UTILS.bhDialogDanger({
                title: '确定要删除该条件吗？',
                buttons: [{
                    text: '确定', className: 'bh-btn-danger',
                    callback: function callback() {
                        $this.parent().remove();
                        _validateCondition();
                    }
                }, { text: '取消', className: 'bh-btn-default' }]
            });
        });
    }
    //增加条件
    function _addCondition() {
        $('.ers-j-add-btn').off('click').on('click', function () {
            $('.ers-j-condition').append(conditionTpl);
            _validateCondition();
        });
    }

    //保存数据
    function _save(instance) {
        $('.ers-j-save-btn').off('click').on('click', function () {
            if (_validate()) {
                $(instance.$element).trigger('save');
            }
        });
    }
    //方案名称失去光标
    function _blurName() {
        $('.ers-j-name').off('blur').on('blur', function () {
            _validateName();
        });
    }

    //事件注册
    function _eventListener(instance) {
        _blurName();
        _addCondition();
        _deleteCondition();
        _save(instance);
    }

    //表单校验 true校验通过， false校验不通过
    function _validate() {
        var flag_name = _validateName();
        var flag_condition = _validateCondition();
        return flag_name && flag_condition;
    }

    function _validateName() {
        var flag = true;
        //方案名称校验
        if ($('.ers-j-name').val() == '') {
            $('.ers-j-name-row').addClass('jqx-validator-error-container').children('.jqx-validator-error-info').removeClass('bh-hide');
            flag = false;
        } else {
            $('.ers-j-name-row').removeClass('jqx-validator-error-container').children('.jqx-validator-error-info').addClass('bh-hide');
            flag = true;
        }
        return flag;
    }

    function _validateCondition() {
        //方案条件校验
        var flag = true;
        if ($('.ers-j-condition').text() == '' || $('.ers-j-condition').children().length == 0) {
            $('.ers-j-condition-row').addClass('jqx-validator-error-container').children('.jqx-validator-error-info').removeClass('bh-hide');
            flag = false;
        } else {
            $('.ers-j-condition-row').removeClass('jqx-validator-error-container').children('.jqx-validator-error-info').addClass('bh-hide');
            flag = true;
        }
        return flag;
    }
    
    function renderConditionTpl(model) {
        
    }
    
    function getModelOptionData(model) {
        var result = [];
        $(model).each(function () {
            result.push({
                id: this.name,
                name: this.caption
            });
        });
        return result;
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapRuleSetting = function (options, params) {
        var instance;
        instance = this.data('emapRuleSetting');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('emapRuleSetting', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.emapRuleSetting.defaults = {};
}).call(undefined);
;(function (WIS_EMAP_SERV, undefined) {
    /**
     * 获取emap pageMeta数据
     * @param  {String} pagePath 页面地址
     * @return {Object}        pageMeta
     */
    WIS_EMAP_SERV.getPageMeta = function(pagePath, params) {
        var params = params || {"*json":"1"};
        var pageMeta = BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(pagePath), params);
        window._EMAP_PageMeta = window._EMAP_PageMeta || {};
        window._EMAP_PageMeta[pagePath] = pageMeta;
        if(typeof pageMeta.loginURL != 'undefined'){
            window._EMAP_PageMeta = {};
        }
        return pageMeta;
    }

    /**
     * 获取emap模型
     * @param  {String} pagePath    页面地址
     * @param  {String} actionID  [description]
     * @param  {String}           [description]
     * @return {Object}           [description]
     */
    WIS_EMAP_SERV.getModel = function(pagePath, actionID, type) {
        // window.sessionStorage.setItem();
        // window._EMAP_PageMeta = window._EMAP_PageMeta || {};

        // var pageMeta = window._EMAP_PageMeta[pagePath];
        // if (pageMeta === undefined) {
        //     pageMeta = this.getPageMeta(pagePath);
        // }
        var pageMeta = this.getPageMeta(pagePath);

        var model;

        if(type == "search"){
            var url = WIS_EMAP_SERV.getAbsPath(pagePath).replace('.do', '/' + actionID + '.do');
            pageMeta = BH_UTILS.doSyncAjax(url, {
                "*searchMeta": "1"
            });
            model = pageMeta.searchMeta;

        }else{
            var getData = pageMeta.models.filter(function(val) {
                return val.name == actionID
            });
            model = getData[0];
        }

        if (model === undefined || model == null) {
            //getData = {code: 0,msg: "没有数据",models:[],datas:{}};
            return undefined;
        } else {
            
            if (type === undefined)
                return model.controls;
            else {
                model.controls.map(function(item) {
                    item.get = function(field) {
                        if (item[type + "." + field] !== undefined)
                            return item[type + "." + field];
                        else
                            return item[field];
                    }
                });
                return model.controls;
            }
        }
    };

    WIS_EMAP_SERV.getData = function(pagePath, actionID, queryKey) {
        window._EMAP_PageMeta = window._EMAP_PageMeta || {};
        var pageMeta = window._EMAP_PageMeta[pagePath];
        if (pageMeta === undefined)
            pageMeta = this.getPageMeta(pagePath);

        var model = pageMeta.models.filter(function(val) {
            return val.name == actionID
        });


        var modelPath = pagePath.substring(0, pagePath.indexOf("/")) + "/" + model[0].url;
        var getData = BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(modelPath), queryKey);
        if (getData === undefined || getData == null) {
            getData = {
                code: 0,
                msg: "没有数据",
                datas: {}
            };
            return {rows:[]};
        } else {
            if (getData.result !== undefined && getData.result.datas !== undefined)
                getData = getData.result;
            return getData.datas[actionID];
        }
    }

    WIS_EMAP_SERV.getCode = function(url, id, name, pid, searchValue) {
        var params = {};
        if (id) params["id"] = id;
        if (name) params["name"] = name;
        if (pid) params["pid"] = pid;
        if (searchValue) params["searchValue"] = searchValue;
        var codeData = BH_UTILS.doSyncAjax(url, params);
        if (codeData === undefined || codeData == null) {
            return undefined;
        } else {
            return codeData.datas.code.rows;
        }
    };

    //name 传入的是string，则只返回一个参数的查询条件
    //name 传入的是array，结构是：[{name:"", value:""},{name:"", value:""}]，则返回多个参数的查询条件
    WIS_EMAP_SERV.buildCodeSearchParam = function(name, value) {
        if($.isArray(name)){
            var list_map = name;
            var result = [];
            for (var i = list_map.length - 1; i >= 0; i--) {
                result.push({name:list_map[i].name,value:list_map[i].value,linkOpt:"and",builder:"equal"});
            };
            return {
                searchValue:JSON.stringify(result)
            };
        }else{
            return {
                searchValue:JSON.stringify([{name:name,value:value,linkOpt:"and",builder:"equal"}])
            };
        }
    };

    WIS_EMAP_SERV.getContextPath = function(){
        var contextPath = "";
        var path = window.location.pathname;
        var end = path.indexOf('/sys/');
        
        return path.substring(0, end) || '/emap';
    };

    WIS_EMAP_SERV.getAppPath = function(){
        var path = window.location.pathname;
        var start = path.indexOf('/sys/') + '/sys/'.length;
        
        var tmpPath = path.substring(start, path.length);
        var app_path = tmpPath.substring(0, tmpPath.indexOf("/"));
        return WIS_EMAP_SERV.getContextPath() + "/sys/" + app_path;
    };

    WIS_EMAP_SERV.getAbsPath = function(page_path){
        if(page_path.substring(0, 7) == "http://" || page_path.substring(0, 8) == "https://"){
            return page_path;
        }
        if(page_path.substring(0, 1) == '/'){
            page_path = page_path.substring(1, page_path.length);
        }
        // if(page_path.substring(0, '*default/'.length) == '*default/'){
        //     page_path = page_path;
        // }
        
        //访问的是页面.do
        var page_found = page_path.match(/module*(.*?)\//);
        if(page_found == null){
            // //路由的绝对路径
            // if(page_path.substring(0, 8) != 'modules/'){
            //     page_path = 'modules/' + page_path;
            // }

            // if(page_path.substring(0, 16) == 'modules/modules/'){
            //     page_path = page_path.slice(8);
            // }
            // if(page_path.substring(0, 15) == 'modules/http://' || page_path.substring(0, 16) == 'modules/https://'){
            //     page_path = page_path.slice(8);
            // }
        }

        var absPath = WIS_EMAP_SERV.getAppPath() + "/" + page_path;
        return absPath;
    }

    if(window.WIS_CONFIG != undefined && (WIS_CONFIG.ROOT_PATH === undefined || WIS_CONFIG.ROOT_PATH == ""))
        WIS_CONFIG.ROOT_PATH = WIS_EMAP_SERV.getAppPath();
    
})(window.WIS_EMAP_SERV = window.WIS_EMAP_SERV || {});

//  多图上传
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var _init; //私有方法

    Plugin = (function () {
        // 实例化部分
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapSingleImageUpload.defaults, options);
            this.$element = $(element);

            if (this.options.token && this.options.token != null && this.options.token != '') {
                this.options.token = this.options.token.toString();
                this.options.scope = this.options.token.substring(0, this.options.token.length - 1);
                this.options.newToken = false;
            } else {
                this.options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
                this.options.token = this.options.scope + 1;
                this.options.newToken = true;
            }

            _init(this.$element, this.options);

        }

        // 公共方法
        Plugin.prototype.getFileToken = function () {
            return this.options.token;
        };

        // 返回token下已有的正式文件的url数组
        Plugin.prototype.getFileUrl = function () {
            var options = this.options;
            var fileArr;
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async : false,
                success: function (res) {
                    if (res.success) {
                        var fileHtml = '';
                        fileArr = $(res.items).map(function(){
                            return this.fileUrl;
                        }).get();
                    }
                }
            });

            return fileArr;
        };

        Plugin.prototype.saveTempFile = function () {
            var resultFlag = false;

            if (!this.settings.tempUpload) {
                return resultFlag;
            }
            //  删除已有的正式文件
            $.ajax({
                type: "post",
                url: this.settings.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + this.settings.token + '.do',
                dataType: "json",
                async : false,
                success: function (data) {
                }
            });


            $.ajax({
                type: "post",
                async: false,
                url: this.options.contextPath
                + "/sys/emapcomponent/file/saveAttachment/"
                + this.options.scope + "/" + this.options.token + ".do",
                data: {
                    attachmentParam: JSON.stringify(this.options.attachmentParams)
                },
                dataType: "json",
                success: function (data) {
                    resultFlag = data;
                }
            });
            return resultFlag;
        };

        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };

        // 私有方法
        _init = function (element, options) {
            var imgWidth = parseInt(options.width) - 6;
            var imgHeight = parseInt(options.height) - 6;

            $(element).addClass('bh-clearfix').append('<p class="bh-file-img-info"></p>' +
                '<div class="bh-file-img-container" style="width: ' + options.width + 'px;">' +
                '<div class="bh-file-img-input bh-file-img-block bh-file-img-single-block" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                '<span class="bh-file-img-single-info">' +
                '<span class="bh-file-img-plus">+</span>' +
                '<span class="bh-file-img-text">点击上传</span>' +
                '</span>' +
                '<input type="file">' +
                '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                '<div class="bh-file-img-fail"></div>' +
                '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="bh-file-img-single-edit">' +
                '<a href="javascript:void(0)" class="bh-file-img-retry">重新上传</a>' +
                '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                '</div>' +
                '</div>');

            // 生成描述信息
            var introText = '请上传图片';
            if (options.type && options.type.length > 0) {
                introText += ', 支持' + options.type.join(',').toUpperCase() + '类型';
            }

            if(options.size && options.size > 0) {
                introText += ',大小在' + options.size/1000 + 'K以内';
            }

            $('.bh-file-img-info', element).html(introText);

            if (options.height <= 100) {
                $('.bh-file-img-text', element).hide();
            }

            // 获取token下已有的文件
            if (!options.newToken) {
                $.ajax({
                    type: "post",
                    url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                    dataType: "json",
                    success: function (res) {
                        if (res.success && res.items && res.items.length > 0) {
                            console.log(res)
                            var imgBlock = $('.bh-file-img-container', element);
                            $('.bh-file-img-table img', imgBlock).attr('src', res.items[0].fileUrl);
                            imgBlock.addClass('saved').data({
                                'fileid' : res.items[0].id
                            });


                        }
                    }
                });
            }

            options.attachmentParams = {
                storeId: options.storeId,
                scope: options.scope,
                fileToken: options.token,
                params: options.params
            };

            options.uploadUrl = options.contextPath + '/sys/emapcomponent/file/uploadTempFile/' + options.scope + '/' + options.token + '.do';

            // 上传input 初始化
            $(element).find('input[type=file]').fileupload({
                url: options.uploadUrl,
                autoUpload: true,
                multiple: options.multiple,
                dataType: 'json',
                limitMultiFileUploads: 1,
                formData: {
                    size: options.size,
                    type: options.type,
                    storeId: options.storeId
                },
                add: function (e, data) {
                    var file = data.files[0];
                    var tmp = new Date().getTime();

                    $('.bh-file-img-container', element).addClass('loading');
                    if (options.add) {
                        options.add(e, data);
                    }
                    data.submit();

                },
                submit: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);


                    // 文件的大小 和类型校验
                    if (options.type && options.type.length > 0) {
                        if (!new RegExp(options.type.join('|').toUpperCase()).test(file.name.toUpperCase())) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件类型不正确');
                            return false;
                        }
                    }

                    if (fileReader && options.size) {
                        if (file.size / 1024 > options.size) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件大小超出限制');
                            return false;
                        }
                    }
                    imgBlock.data('xhr', data);

                    if (options.submit) {
                        options.submit(e, data);
                    }
                },
                done: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);

                    if (data.result.success) {
                        // 上传成功
                        imgBlock.removeClass('loading').addClass('success');
                        options.tempUpload = true;
                        $('img', imgBlock).attr('src', data.result.tempFileUrl);
                        imgBlock.data({
                            'fileid' : data.result.id,
                            'deleteurl' : data.result.deleteUrl
                        });
                        if (options.done) {
                            options.done(e, data)
                        }
                    } else {
                        // 上传失败
                        imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html(data.result.error ? data.result.error : '上传失败');
                        if (options.fail) {
                            options.fail(e, data)
                        }
                    }

                },
                fail: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);
                    imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('上传失败');
                    if (options.fail) {
                        options.fail(e, data)
                    }
                }
            });

            // 删除事件绑定
            $(element).on('click', '.bh-file-img-delete', function(){
                var imgBlock = $(this).closest('.bh-file-img-container');
                if (imgBlock.hasClass('success')) {
                    // 删除临时文件
                    $.ajax({
                        type: "post",
                        url: imgBlock.data('deleteurl'),
                        dataType: "json",
                        data: {
                            attachmentParam: JSON.stringify({
                                storeId: options.storeId,
                                scope: options.scope,
                                fileToken: options.token,
                                items: [{
                                    id: imgBlock.data('fileid'),
                                    status: 'Delete'
                                }]
                            })
                        },
                        success: function (data) {
                            if (data.success) {
                                imgBlock.removeClass('success');
                                $('.bh-file-img-table img', imgBlock).attr('src', '');
                            }
                        }
                    });
                } else if(imgBlock.hasClass('error')) {
                    // 错误文件直接删除
                    imgBlock.removeClass('error');
                } else if(imgBlock.hasClass('loading')) {
                    //  删除正在上传的文件
                    imgBlock.data('xhr').abort();
                    imgBlock.removeClass('loading');
                } else if(imgBlock.hasClass('saved')){
                    // 删除正式文件
                    // 在保存时  正式图片才被删除
                    imgBlock.removeClass('saved');
                    $('.bh-file-img-table img', imgBlock).attr('src', '');
                    options.tempUpload = true;
                    //$.ajax({
                    //    type: "post",
                    //    url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do',
                    //    dataType: "json",
                    //    success: function (data) {
                    //        if (data.success) {
                    //            $('.bh-file-img-table img', imgBlock).attr('src', '');
                    //            imgBlock.removeClass('saved');
                    //        }
                    //    }
                    //});
                }
            });

            // 重新上传时间绑定
            $(element).on('click', '.bh-file-img-retry', function(){
                var imgBlock = $('.bh-file-img-container', element);
                imgBlock.removeClass('saved success fail loading');
                $('.bh-file-img-table img', imgBlock).attr('src', '');
                $('input[type=file]', imgBlock).click();
            });

        };

        // 定义插件
        $.fn.emapSingleImageUpload = function (options) {
            var instance;
            instance = this.data('plugin');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function () {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('plugin', new Plugin(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options]();
            }
        };

        // 插件的默认设置
        $.fn.emapSingleImageUpload.defaults = {
            tempUpload : false,
            multiple: false,
            dataType: 'json',
            storeId: 'image',
            width: 200,
            height: 150,
            type: ['jpg', 'png', 'bmp'],
            size: 0
        };


    })();

}).call(this);
(function () {
    var Plugin,
        _init,
        _getValidateCondition,
        _getValueLength;  //插件的私有方法

    Plugin = (function () {

        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapValidate.defaults, options);
            this.$element = $(element);
            _init($(element), options);

        }
        Plugin.prototype.validate = function () {
            return this.$element.jqxValidator('validate');
        };
        return Plugin;
    })();

    _init = function(element, options){
        var validateRules =  _getValidateCondition(element, options);
        if (options.callback) {
            options.callback(validateRules);
        }
        element.jqxValidator({
            useHintRender:true,
            rules: validateRules
        });
    };

    _getValidateCondition = function(element, options) {
        var rules = [];
        $('[xtype]', element).each(function(){
            var _this = $(this);
            var itemRules;
            // 跳过隐藏字段
            if (_this.closest('.bh-row').attr('hidden')) return true;
            var row = _this.closest('.bh-row');
            var name = _this.data('name');
            var label = $('label.bh-form-label', row).text();
            var xtype = _this.attr('xtype');

            //  必填校验
            if ($('.bh-required', row).length > 0){
                itemRules = {
                    input: '[data-name=' + name + ']',
                    message: label + '不能为空',
                    action: 'change, blur, valuechanged',
                    rule: 'required'
                };
                if (xtype == 'select' || xtype == 'date-local' || xtype == 'date-ym') {
                    itemRules.rule = function() {
                        return _this.val() != '';
                    }
                }
                rules.push(itemRules);
            }

            // 内容长度校验
            // var maxLength = _this.attr('maxlength');
            var maxLength = _this.data('checksize');
            if (!maxLength) {
                maxLength = _this.data('size') ? _this.data('size') : 0;
            }

            if (maxLength) {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: label + '不能超过' + maxLength + '字', 
                    action: 'change, blur, valuechanged', 
                    rule: function () {
                        return _getValueLength(_this.val()) <= maxLength;
                    }
                });

            }

            if(maxLength && maxLength != 'undefined') {
                rules.push({input: '[data-name=' + name + ']', message: label + '不能超过' + maxLength + '字', action: 'change, blur, valuechanged', rule: 'maxLength=' + maxLength });
            }


            // 类型校验
            var checkType = decodeURI(_this.data('checktype'));
            checkType = checkType.replace(/\[|\]|\"|custom/g, "");
            if ($.fn.emapValidate.defaultRules[checkType]) {
                itemRules = {
                    input: '[data-name=' + name + ']', 
                    message: $.fn.emapValidate.defaultRules[checkType].alertText,
                    action: 'change, blur, valuechanged',
                    rule: function () {
                        return new RegExp($.fn.emapValidate.defaultRules[checkType].regex).test(_this.val());
                    }
                };
                rules.push(itemRules);
            } else {
                // 自定义校验
            }
        });
        return rules;
    };

    // 获取取值长度   中文为 2个字符
    _getValueLength = function (val) {
        return val.replace(/[\u4E00-\u9FA5]/g,'**').length;
    };

    // _checkTypeFunc = {
    //     customemail : { // email
    //         label : "邮箱",
    //         regex : "\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"
    //     },
    //     customphone : {
    //         label : "手机号", // 手机号
    //         regex : "^(\\+)?(0|86)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$"
    //     },
    //     customtel : {  // 电话号码
    //         label : "电话号码",
    //         regex : "^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$"
    //     },
    //     customchinaZip : {  // 邮编
    //         label : "邮编",
    //         regex : "^[1-9][0-9]{5}$"
    //     },
    //     customchinaIdLoose : {  // 身份证号
    //         label : "身份证号",
    //         regex : "^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$"
    //     },
    //     customnumber : {  // 数字
    //         label : "数字",
    //         regex : "^(-?\\d+)(\\.\\d+)?$"
    //     },
    //     custominteget : {  // 整数
    //         label : "整数",
    //         regex : "^-?\\d+$"
    //     },
    //     customchinese : {  // 只认中文
    //         label : "中文",
    //         regex : "^[\u4e00-\u9fa5]{0,}$"
    //     }
    // };

    $.fn.emapValidate = function (options) {
        var instance;
        instance = this.data('validate');
        if (!instance) {
            return this.each(function () {
                return $(this).data('validate', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options]();
        return this;
    };

    $.fn.emapValidate.defaults = {
        property1: 'value',
        property2: 'value'
    };

    $.fn.emapValidate.defaultRules = {
        "dateRange":{
            "regex":"none",
            "alertText":"* 无效的 ",
            "alertText2":" 日期范围"
        },
        "dateTimeRange":{
            "regex":"none",
            "alertText":"* 无效的 ",
            "alertText2":" 时间范围"
        },
        "minSize":{
            "regex":"none",
            "alertText":"最少 ",
            "alertText2":" 个字符"
        },
        "maxSize":{
            "regex":"none",
            "alertText":"最多 ",
            "alertText2":" 个字符"
        },
        "groupRequired":{
            "regex":"none",
            "alertText":"* 至少填写其中一项"
        },
        "min":{
            "regex":"none",
            "alertText":"* 最小值为 "
        },
        "max":{
            "regex":"none",
            "alertText":"* 最大值为 "
        },
        "past":{
            "regex":"none",
            "alertText":"* 日期需在 ",
            "alertText2":" 之前"
        },
        "future":{
            "regex":"none",
            "alertText":"* 日期需在 ",
            "alertText2":" 之后"
        },
        "maxCheckbox":{
            "regex":"none",
            "alertText":"* 最多选择 ",
            "alertText2":" 个项目"
        },
        "minCheckbox":{
            "regex":"none",
            "alertText":"* 最少选择 ",
            "alertText2":" 个项目"
        },
        "equals":{
            "regex":"none",
            "alertText":"* 两次输入的密码不一致"
        },
        "creditCard": {
            "regex": "none",
            "alertText": "* 无效的信用卡号码"
        },
        "phone":{
            // credit:jquery.h5validate.js / orefalo
            "regex":/^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
            "alertText":"无效的电话号码"
        },
        "email":{
            // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
            "regex":/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            "alertText":"无效的邮件地址"
        },
        "integer":{
            "regex":/^[\-\+]?\d+$/,
            "alertText":"无效的整数"
        },
        "number":{
            // Number, including positive, negative, and floating decimal. credit:orefalo
            "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
            "alertText":"无效的数值"
        },
        "date":{
            "regex":/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
            "alertText":"无效的日期，格式必需为 YYYY-MM-DD"
        },
        "ipv4":{
            "regex":/^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
            "alertText":"无效的 IP 地址"
        },
        "url":{
            "regex":/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
            "alertText":"无效的网址"
        },
        "onlyNumberSp":{
            "regex":/^[0-9\ ]+$/,
            "alertText":"只能填写数字"
        },
        "onlyLetterSp":{
            "regex":/^[a-zA-Z\ \']+$/,
            "alertText":"只能填写英文字母"
        },
        "onlyLetterNumber":{
            "regex":/^[0-9a-zA-Z]+$/,
            "alertText":"只能填写数字与英文字母"
        },
        //tls warning:homegrown not fielded
        "dateFormat":{
            "regex":/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
            "alertText":"无效的日期格式"
        },
        //tls warning:homegrown not fielded
        "dateTimeFormat":{
            "regex":/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
            "alertText":"* 无效的日期或时间格式",
            "alertText2":"可接受的格式： ",
            "alertText3":"mm/dd/yyyy hh:mm:ss AM|PM 或 ",
            "alertText4":"yyyy-mm-dd hh:mm:ss AM|PM"
        },

        /**
         * 正则验证规则补充
         * Author: ciaoca@gmail.com
         * Date: 2013-10-12
         */
        "chinese":{
            "regex":/^[\u4E00-\u9FA5]+$/,
            "alertText":"* 只能填写中文汉字"
        },
        "chinaId":{
            /**
             * 2013年1月1日起第一代身份证已停用，此处仅验证 18 位的身份证号码
             * 如需兼容 15 位的身份证号码，请使用宽松的 chinaIdLoose 规则
             * /^[1-9]\d{5}[1-9]\d{3}(
             * 	(
             * 		(0[13578]|1[02])
             * 		(0[1-9]|[12]\d|3[01])
             * 	)|(
             * 		(0[469]|11)
             * 		(0[1-9]|[12]\d|30)
             * 	)|(
             * 		02
             * 		(0[1-9]|[12]\d)
             * 	)
             * )(\d{4}|\d{3}[xX])$/i
             */
            "regex":/^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/,
            "alertText":"* 无效的身份证号码"
        },
        "chinaIdLoose":{
            "regex":/^(\d{18}|\d{15}|\d{17}[xX])$/,
            "alertText":"* 无效的身份证号码"
        },
        "chinaZip":{
            "regex":/^\d{6}$/,
            "alertText":"* 无效的邮政编码"
        },
        "qq":{
            "regex":/^[1-9]\d{4,10}$/,
            "alertText":"* 无效的 QQ 号码"
        },
        "maxLength":{
            func:function(field,rules,i,options){
                var max = rules[i+2];
                var val = field.val();
                var len = 0;
                for (var index = 0; index < val.length; index++) {
                    if(val[index].match(/[^\x00-\xff]/ig) != null){
                        len += 3;
                    }else{
                        len++;
                    }
                }
                options.allrules.maxLength.alertText = "* 内容过长，超过 " + (len - max) + " 个字符";
                return max >= len;
            }//,
            // "alertText":"* 内容过长"
        },
        "before" : {
            "func" : function(field,rules,i,options){
                var title = $.trim(field.closest(".form-group").find(".control-label").text());
                var title1 = "";
                var p=rules[i + 2];
                var $form = field.closest("form");
                var fieldAlt = $form.find("*[name='" + p.replace(/^#+/, '') + "']");
                if(fieldAlt.size() > 0){
                    fieldAlt.validationEngine("hide");
                }
                if(!field.val()){
                    return true;
                }
                var pdate = null;
                if (p.toLowerCase() == "now") {
                    pdate = new Date();
                    title1 = "当前时间";
                } else if (fieldAlt.size() > 0) {
                    if(fieldAlt.val()){
                        pdate = $.parseDate(fieldAlt.val());
                    }
                    title1 = $.trim(fieldAlt.closest(".form-group").find(".control-label").text());
                } else {
                    pdate = $.parseDate(p);
                    title1 = p;
                }
                if(!pdate){
                    return true;
                }
                var vdate = $.parseDate(field.val());
                if (vdate > pdate ) {
                    options.allrules.before.alertText = title + "不能晚于" + title1;
                    return false;
                }
                return true;
            }
        },
        "after" : {
            "func" : function(field,rules,i,options){
                var title = $.trim(field.closest(".form-group").find(".control-label").text());
                var title1 = "";
                var p=rules[i + 2];
                var $form = field.closest("form");
                var fieldAlt = $form.find("*[name='" + p.replace(/^#+/, '') + "']");
                if(fieldAlt.size() > 0){
                    fieldAlt.validationEngine("hide");
                }
                if(!field.val()){
                    return true;
                }
                var pdate = null;

                if (p.toLowerCase() == "now") {
                    pdate = new Date();
                    title1 = "当前时间";
                } else if (fieldAlt.size() > 0) {
                    if(fieldAlt.val()){
                        pdate = $.parseDate(fieldAlt.val());
                    }
                    title1 = $.trim(fieldAlt.closest(".form-group").find(".control-label").text());
                } else {
                    pdate = $.parseDate(p);
                    title1 = p;
                }
                if(!pdate){
                    return true;
                }
                var vdate = $.parseDate(field.val());
                if (vdate < pdate ) {
                    options.allrules.after.alertText = title + "不能早于" + title1;
                    return false;
                }
                return true;
            }
        }
    }

}).call(this);
