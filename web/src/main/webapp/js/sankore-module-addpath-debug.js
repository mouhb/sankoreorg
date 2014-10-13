Ext.ns('Curriki.module.addpath');
Curriki.module.addpath.init = function() {
  if (Ext.isEmpty(Curriki.module.addpath.initialized)) {
    // Local alias
    var AddPath = Curriki.module.addpath;

    AddPath.ie_size_shift = 10;

    AddPath.EnableNext = function() {
      Ext.getCmp('nextbutton').enable();
    }
    AddPath.DisableNext = function() {
      Ext.getCmp('nextbutton').disable();
    }

    AddPath.RadioSelect = function(e, checked){
      var entry_box;
      var change = false;

      entry_box = Ext.getCmp(e.value+'-entry-box');
      if (entry_box) {
        // Is a component
        if (entry_box.isVisible() != checked) {
          change = true;
          entry_box.setVisible(checked);
          entry_box.setDisabled(!checked);
        }
      } else {
        // Is just a HTML element
        entry_box = Ext.get(e.value+'-entry-box');
        if (entry_box && entry_box.isVisible() != checked) {
          entry_box.setVisibilityMode(Ext.Element.DISPLAY).setVisible(checked);
        }
      }

      entry_box = Ext.getCmp(e.value+'-entry-value');
      if (change && entry_box) {
        // Has a value component
        entry_box.setDisabled(!checked);
      }

      entry_box = Ext.getCmp(e.value+'-container-cmp');
      if (change && entry_box) {
        if (entry_box.isVisible() != checked) {
          entry_box.setVisible(checked);
          entry_box.setDisabled(!checked);
        }
      }

      var dlg = Ext.getCmp(AddPath.AddSourceDialogueId);
      if (dlg) {
        dlg.doLayout();
        dlg.syncShadow();
      }
    }


    AddPath.AddSourceDialogueId = 'resource-source-dialogue';
    AddPath.AddSource = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent: function() {
        Ext.apply(this, {
           title:_('add.contributemenu.title_addto_'+(this.toFolder?'composite':'site'))
          ,cls:'addpath addpath-source resource resource-add'
          ,id:AddPath.AddSourceDialogueId
          ,width:400                    
          ,items:[{
             xtype:'panel'
            ,cls:'guidingquestion-container'
            ,items:[{
               xtype:'box'
              ,autoEl:{
                 tag:'div'
                ,html:this.toFolder
                  ?_('add.contributemenu.guidingquestion_addto_composite', this.folderName)
                  :_('add.contributemenu.guidingquestion_addto_site')
                ,cls:'guidingquestion'
              }
            }]
          },{
             xtype:'form'
            ,id:'addDialoguePanel'
            ,formId:'addDialogueForm'            
            ,cls:'form-container'
            ,labelWidth:25
            ,autoScroll:false
            ,autoHeight:true
            ,autoWidth:true
            ,border:false
            ,defaults:{
               labelSeparator:''
              ,hideLabel:true
              ,name:'assetSource'
            }
            ,bbar:[{
               text:_('add.contributemenu.cancel.button')
              ,id:'cancelbutton'
              ,cls:'button button-cancel mgn-rt'
              ,listeners:{
                click:{
                   fn: function(){
                      this.close();
                      window.location.href = Curriki.current.cameFrom;
                    }
                  ,scope:this
                }
              }
            },'->',{
               text:_('add.contributemenu.next.button')
              ,id:'nextbutton'
              ,cls:'button button-confirm'
              ,listeners:{
                click:{
                  single:true
                  ,fn: function(){
                    var form = this.findByType('form')[0].getForm();
                    var selected = (form.getValues(false))['assetSource'];
                    if (form.isValid()){
                      AddPath.SourceSelected(selected, form.getValues(false));                      
                    } else {
                      alert((_('add.contributemenu.required.fields.dialog_'+selected) !== 'add.contributemenu.required.fields.dialog_'+selected)?_('add.contributemenu.required.fields.dialog_'+selected):_('add.contributemenu.required.fields.dialog'));
                    }
                  }
                  ,scope:this
                }
              }
            }]
            ,monitorValid:true
            ,listeners:{
              render:function(fPanel) {
              //TODO: Try to generalize this (for different # of panels)
                fPanel.ownerCt.on(
                  'bodyresize'
                  ,function(wPanel, width, height){
                    if (height === 'auto') {
                      fPanel.setHeight('auto');
                    } else {
                      fPanel.setHeight(wPanel.getInnerHeight()-(wPanel.findByType('panel')[0].getBox().height+(Ext.isIE?AddPath.ie_size_shift:0)));
                    }
                  }
                );
              }
            }
            ,items:[{
            // Something had
               xtype:'box'
              ,autoEl:{
                 tag:'div'
                ,html:_('add.contributemenu.subtitle_have')
                ,cls:'subtitle'
              }

            // File upload
            },{
               xtype:'radio'
              ,value:'file'
              ,inputValue:'file'
              ,boxLabel:_('add.contributemenu.option.file')
              ,checked:true
              ,listeners:{
                check:AddPath.RadioSelect
              }
            },{
               xtype:'container'
              ,id:'file-container-cmp'
              ,autoEl:{
                 tag:'div'
                ,id:'file-container'
                ,html:''
              }
              ,items:[{
                 xtype:'textfield'
                ,inputType:'file'
                ,id:'file-entry-box'
                ,name:'filepath'
                ,allowBlank:false
                ,preventMark:true
                ,hideMode:'display'
                ,hideLabel:true
    //            ,hidden:true
    //            ,disabled:true
                ,listeners:{ // focus, invalid, blur, valid
                  focus:function(){
                    var pName = Ext.getCmp('file-entry-box').getValue();
                    var i = pName.lastIndexOf('\\');
                    var j = pName.lastIndexOf('/');

                    var k = (i>j)?i:j;
                    pName = pName.substring(k+1);

                    Ext.getCmp('filename-entry-box').setValue(pName);
                  }
                }
              },{
                 xtype:'textfield'
                ,id:'filename-entry-box'
                ,name:'filename'
                ,allowBlank:false
                ,preventMark:true
                ,hideLabel:true
                ,hidden:true
                ,disabled:true
              },{
               xtype:'box'
               ,id:'file-progress-tip'
               ,hidden:true              
              ,autoEl:{
                 tag:'div'
                ,html:_('add.contributemenu.file.progress.label')                
              }
            },{
                xtype:'progress'
                ,id:'file-progress-box'
                ,animate:false
                ,text:_('add.contributemenu.file.progress.text')
                ,hidden:true                
              }]

    // VIDITalk Video Upload
    /*        },{
               xtype:'radio'
              ,value:'video_upload'
              ,inputValue:'video_upload'
              ,boxLabel:_('add.contributemenu.option.video_upload')
              ,listeners:{
                check:AddPath.RadioSelect
              }
            },{
               xtype:'container'
              ,id:'video_upload-entry-box'
              ,hidden:true
              ,autoEl:{
                 tag:'div'
                ,id:'video_upload-container'
                ,html:''
              }
              ,listeners:{
                show:function(){
                  window.uploadComplete = function(videoId) {
                    Ext.getCmp('video_upload-entry-value').setValue(videoId);
                    // TODO: I think there is a better way to do this
                    Ext.getCmp('nextbutton').events.click.fire();
                  }
                  window.capture_div='';
                  window.flashLoaded=false;
                  window.called_once=false;
                  embedVidiCapture('video_upload-entry-video', _('viditalk.sitecode'), null, null, false);
                }
                ,hide:function(){
                  if (Ext.get('video_upload-entry-video')) {
                    Ext.DomHelper.overwrite(Ext.get('video_upload-entry-video'), '');
                  }
                }
              }
              ,items:[{
                 xtype:'textfield'
                ,id:'video_upload-entry-value'
                ,allowBlank:false
                ,preventMark:true
                ,hidden:true
                ,disabled:true
              },{
                 xtype:'box'
                ,id:'video_upload-entry-video'
                ,autoEl:{
                   tag:'div'
                  ,html:''
                  ,height:'320px'
                }
              }]  */

    // External Web Link
            },{
               xtype:'radio'
              ,value:'link'
              ,inputValue:'link'
              ,boxLabel:_('add.contributemenu.option.link')
              ,listeners:{
                check:AddPath.RadioSelect
              }
            },{
               xtype:'container'
              ,id:'link-container-cmp'
              ,hidden:true
              ,autoEl:{
                 tag:'div'
                ,id:'link-container'
                ,html:''
              }
              ,items:[{
                 xtype:'textfield'
                ,id:'link-entry-box'
                ,name:'link'
                //,emptyText:_('add.contributemenu.link.empty_msg')
                ,value:'http://'
                ,disabled:true
                ,hidden:true
                ,allowBlank:false
                ,preventMark:true
                ,hideMode:'display'
                ,hideLabel:true
                ,vtype:'url'
              }]

    // Search Repository
            },{
               xtype:'radio'
              ,value:'repository'
              ,inputValue:'repository'
              ,boxLabel:_('add.contributemenu.option.repository')
  // TODO: Removed for EOU1, add back in EOU2
              ,hidden:true|| !this.toFolder
              ,hideLabel:true|| !this.toFolder
              ,hideParent:true



    // Something to make
            },{
               xtype:'box'
              ,autoEl:{
                 tag:'div'
                ,html:_('add.contributemenu.subtitle_make')
                ,cls:'subtitle'
              }

    // Create with Template
            /*},{
               xtype:'radio'
              ,value:'template'
              ,inputValue:'template'
              ,boxLabel:_('add.contributemenu.option.template')*/

    // Create "from scratch"
            /*},{
               xtype:'radio'
              ,value:'scratch'
              ,inputValue:'scratch'
              ,boxLabel:_('add.contributemenu.option.scratch')*/

    // Create with VIDITalk
            /*},{
               xtype:'radio'
              ,value:'video_capture'
              ,inputValue:'video_capture'
              ,boxLabel:_('add.contributemenu.option.video_capture')
              ,listeners:{
                check:{
                  fn:function(e, checked){
                    AddPath.RadioSelect(e, checked);
                    Ext.fly('video_capture-container').scrollIntoView('addDialogueForm');
                  }
                  ,scope:this
                }
              }
            },{
               xtype:'container'
              ,id:'video_capture-entry-box'
              ,listeners:{
                show:function(){
                  window.uploadComplete = function(videoId) {
                    Ext.getCmp('video_capture-entry-value').setValue(videoId);
                    // TODO: I think there is a better way to do this
                    Ext.getCmp('nextbutton').events.click.fire();
                  }
                  window.capture_div='';
                  window.flashLoaded=false;
                  window.called_once=false;
                  embedVidiCapture('video_capture-entry-video', _('viditalk.sitecode'), null, null, false);
                }
                ,hide:function(){
                  if (Ext.get('video_capture-entry-video')) {
                    Ext.DomHelper.overwrite(Ext.get('video_capture-entry-video'), '');
                  }
                }
              }
              ,hidden:true
              ,items:[{
                 xtype:'textfield'
                ,id:'video_capture-entry-value'
                ,allowBlank:false
                ,preventMark:true
                ,hidden:true
                ,disabled:true
              },{
                 xtype:'box'
                ,id:'video_capture-entry-video'
                ,autoEl:{
                   tag:'div'
                  ,html:''
                  ,height:'320px'
                }
              }]
              ,autoEl:{
                 tag:'div'
                ,id:'video_capture-container'
                ,html:''
              } */

    // Create folder
            },{
               xtype:'radio'
              ,value:'folder'
              ,inputValue:'folder'
              ,boxLabel:_('add.contributemenu.option.folder')
              ,hidden:!this.toFolder
              ,hideParent:true
            }]
          }]
        });

        AddPath.AddSource.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSource', AddPath.AddSource);


    AddPath.TemplateList = function() {
      var pfx = 'add.select'+Curriki.current.templateType;

      var retVal = [];

      var i = 1;
      while(_(pfx+'.list'+i+'.header') !== pfx+'.list'+i+'.header'){
        var tpl = [];
        tpl.push({
           xtype:'radio'
          ,name:'templateName'
          ,value:'list'+i
          ,checked:(i===1?true:false) // Default first as checked
          ,boxLabel:_(pfx+'.list'+i+'.header')
          ,listeners:{
            check:AddPath.TemplateSelect
          }
        });
        tpl.push({
           xtype:'box'
          ,autoEl:{
             tag:'div'
            ,html:_(pfx+'.list'+i+'.description')
            ,cls:'description'
          }
        });

        retVal.push({
           xtype:'container'
          ,id:'selecttemplate-list'+i
          ,items:tpl
          ,autoEl:{
             tag:'div'
            ,id:'selecttemplate-list'+i+'-box'
            ,html:''
          }
        });

        ++i;
      }

      // Default to first item in the list
      Curriki.current.submitToTemplate = _(pfx+'.list1.url');

      return retVal;
    };

    AddPath.TemplateSelect = function(radio, selected) {
      var pfx = 'add.select'+Curriki.current.templateType;
      if (selected) {
        // CURRIKI-2434
        // - Gets called while dialogue is being created (before shown)
        //   so need to check if item is shown yet
        var img = Ext.get('selecttemplate-thumbnail-image');
        if (!Ext.isEmpty(img)) {
          img.set({'src': _(pfx+'.'+radio.value+'.thumbnail')});
          Curriki.current.submitToTemplate = _(pfx+'.'+radio.value+'.url');
        }
      }
    };

    AddPath.SelectTemplate = Ext.extend(Curriki.ui.dialog.Actions, {
        initComponent:function(){
        var tmplPfx = 'add.select'+Curriki.current.templateType;
        var dlgType = (Curriki.current.templateType === 'format')?'Format':'Template';

        Ext.apply(this, {
           id:'SelectTemplateDialogueWindow'
          ,title:_(tmplPfx+'.title')
          ,cls:'addpath addpath-templates resource resource-add'
          ,border:false
          ,bodyBorder:false
          ,items:[{
             xtype:'box'
            ,autoEl:{
               tag:'div'
              ,html:_(tmplPfx+'.guidingquestion')
              ,cls:'guidingquestion'
            }
          },{
             xtype:'box'
            ,hidden:!(Curriki.current.templateType == 'format')
            ,autoEl:{
               tag:'div'
              ,html:_('add.selectformat.instruction')
              ,cls:'instructionTxt'
              ,hidden:!(Curriki.current.templateType == 'format')
            }
          },{
             xtype:'form'
            ,id:'SelectTemplateDialoguePanel'
            ,formId:'Select'+dlgType+'DialogueForm'
            ,border:false
            ,bodyBorder:false
            ,labelWidth:25
            ,defaults:{
               labelSeparator:''
              ,border:false
              ,bodyBorder:false
            }
            ,buttonAlign:'right'
            ,buttons:[{
               text:_(tmplPfx+'.cancel.button')
              ,id:'cancelbutton'
              ,cls:'button button-cancel mgn-rt'
              ,listeners:{
                'click':function(e, ev){
                  Ext.getCmp(e.id).ownerCt.ownerCt.close();
                  window.location.href = Curriki.current.cameFrom;
                }
              }
            },{
               text:_(tmplPfx+'.next.button')
              ,id:'nextbutton'
              ,cls:'button button-confirm'
              ,listeners:{
                'click':function(e, ev){
                  AddPath.PostToTemplate(Curriki.current.submitToTemplate);
                  Ext.getCmp(e.id).ownerCt.ownerCt.close();
                }
              }
            }]
            ,items:[{
              id:'selecttemplate-form-container'
              ,layout:'column'
              ,defaults:{border:false}
              ,items:[{
                 columnWidth:0.55
                ,items:[{
                   xtype:'container'
                  ,id:'selecttemplate-list'
                  ,items:AddPath.TemplateList()
                  ,autoEl:{
                     tag:'div'
                    ,id:'selecttemplate-list-box'
                    ,html:''
                  }
                }]
              },{
                 columnWidth:0.35
                ,items:[{
                   xtype:'box'
                  ,id:'selecttemplate-thumbnail-container'
                  ,anchor:''
                  ,autoEl:{
                     tag:'div'
                    ,id:'selecttemplate-thumbnail'
                    ,style:'margin:8px 0 8px 10px'
                    ,children:[{
                       tag:'img'
                      ,id:'selecttemplate-thumbnail-image'
                      ,src:_(tmplPfx+'.list1.thumbnail')
                      ,onLoad:"Ext.getCmp('SelectTemplateDialogueWindow').syncShadow();"
                    }]
                  }
                }]
              }]
            }]
          }]
        });

        AddPath.SelectTemplate.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSelectTemplate', AddPath.SelectTemplate);
    
    AddPath.UrlMetadata1 = Ext.extend(Curriki.ui.dialog.Bookmarklet, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('bookmarklet.add.setrequiredinfo.part1.title')          
          ,cls:'addpath addpath-metadata resource resource-add'
          ,id:'MetadataDialogue'          
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel1'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false                       
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton' 
                ,text: __('bookmarklet.add.setrequiredinfo.switch.advanced')
                ,id:'switchbutton'
                ,cls: 'button button-switch'
                ,align: 'left'
                ,enableToggle:true
                ,listeners: {
                  toggle: {
                    fn: function(btn, pressed) {
                      if (pressed) {
                        btn.setText(__('bookmarklet.add.setrequiredinfo.switch.simple'));
                        var publishbtn = Ext.getCmp('publishbutton');
                        publishbtn.hide();
                        var nextbtn = Ext.getCmp('nextbutton');
                        nextbtn.show();
                        var dialog = Ext.getCmp('MetadataDialogue');
                        //dialog.header.show();
                        dialog.syncSize();
                      } else {
                        btn.setText(__('bookmarklet.add.setrequiredinfo.switch.advanced'));
                        var publishbtn = Ext.getCmp('publishbutton');
                        publishbtn.show();
                        var nextbtn = Ext.getCmp('nextbutton');
                        nextbtn.hide();
                        var dialog = Ext.getCmp('MetadataDialogue');
                        //dialog.header.hide();
                        dialog.syncSize();
                      }                     
                    }
                  }
                }
              },'->','->',{
                xtype: 'tbbutton'                    
                ,text:_('bookmarklet.add.setrequiredinfo.part1.publish.button')
                ,id:'publishbutton'
                ,cls:'button button-publish mgn-rt'                    
                ,listeners:{
                  click:{
                    fn: function(){                                        
                      var form = this.findByType('form')[0].getForm();             
                      if(!Curriki.current.sri)
                        Curriki.current.sri = form.getValues(false);
                      else
                        Ext.apply(Curriki.current.sri, form.getValues(false));
                                           
                      this.close();
                      
                      AddPath.MetadataFinished();                                                      
                    }
                    ,scope:this
                  }
                }
              },{
                xtype: 'tbbutton'                     
                ,text:_('bookmarklet.add.setrequiredinfo.part1.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,hidden:true                    
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                       
                      if(!Curriki.current.sri)
                        Curriki.current.sri = form.getValues(false);
                      else
                        Ext.apply(Curriki.current.sri, form.getValues(false));
                              
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM2'});
                      p.show();
                      Ext.ComponentMgr.register(p);                        
                    }
                    ,scope:this
                  }
                }
              }
              ]
            }            
            ,monitorValid:true
            ,items:[{                
              xtype:'textfield'
              ,id:'metadata-link-entry'
              ,name:'link'
              ,emptyText:_('bookmarklet.sri.link_content')
              ,allowBlank:false
              ,preventMark:true
              ,hideLabel:true
              ,value: Ext.parseURIQuery(window.location.href)['url']
              ,width:'80%'
              ,hidden:true
            },{
    // Title
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-title'
                  ,cls:'information-header information-header-required'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-title-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.title_title')
                  },{
                    tag:'img'
                    ,id:'metadata-title-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.title_tooltip')
                  }]
                }
              },{
                xtype:'textfield'
                ,id:'metadata-title-entry'
                ,name:'title'
                ,emptyText:_('bookmarklet.sri.title_content')
                ,allowBlank:false
                ,preventMark:true
                ,hideLabel:true
                ,width:'72%'
                ,value: Curriki.current.sri&&Curriki.current.sri.title?Curriki.current.sri.title:Ext.parseURIQuery(window.location.href)['title']
              }]            
            },{
    // Rating
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-rating'
                  ,cls:'information-header information-header-required'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-rating-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.rating_title')
                  },{
                    tag:'img'
                    ,id:'metadata-rating-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.rating_tooltip')
                  }]
                }
              },{
                xtype: 'rating'
                ,id: 'metadata-rating-entry'
                ,hideLabel:true
                ,name:'rating'
                ,minValue:1
                ,maxValue:5
                ,value:Curriki.current.sri?Curriki.current.sri.rating:0              
              }]
            },{
    // Description
              xtype:'container'
              ,cls:'metadata-entry'
              ,items:[{
                xtype:'textarea'
                ,id:'metadata-description-entry'
                ,name:'description'
                ,emptyText:_('bookmarklet.sri.description.empty_msg')
                ,allowBlank:false
                ,preventMark:true
                ,hideLabel:true
                ,value:Curriki.current.sri?Curriki.current.sri.description:''
                ,width:'98%'
              }]
            },{
    // Keywords
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype: 'box',
                autoEl: {
                  tag: 'div',
                  id: 'metadata-keywords',
                  cls: 'information-header',
                  children: [{
                    tag: 'span',
                    id: 'metadata-keywords-title',
                    cls: 'metadata-title',
                    html: _('bookmarklet.sri.keywords_title')
                  }, {
                    tag: 'img',
                    id: 'metadata-keywords-info',
                    cls: 'metadata-tooltip',
                    src: Curriki.ui.InfoImg,
                    qtip: _('bookmarklet.sri.keywords_tooltip')
                  }]
                }
              },{
                xtype: 'textfield',
                id: 'metadata-keywords-entry',
                name: 'keywords',
                emptyText: _('bookmarklet.sri.keywords.empty_msg'),
                hideLabel: true,
                width: '72%',
                value:Curriki.current.sri?Curriki.current.sri.keywords:'',
                listeners: {
                  render: function(comp){
                    comp.findParentByType('apUrlM1').on('show', function(){
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;
                          
                        if (!Ext.isEmpty(md.keywords)) {
                          if (Ext.isArray(md.keywords)) {
                            md.keywords = md.keywords.join(' ');
                          }
                          Ext.getCmp('metadata-keywords-entry').setValue(md.keywords);
                        }
                      }
                    })
                  }
                }
              }]
            }]
          }]
        });

        AddPath.UrlMetadata1.superclass.initComponent.call(this);
      }
      ,afterShow : function() {
        AddPath.UrlMetadata1.superclass.afterShow.apply(this, arguments);
        //this.header.setVisibilityMode(Ext.Element.DISPLAY);
        //this.header.hide();
        this.updateTopLocation();
      }
    });
    Ext.reg('apUrlM1', AddPath.UrlMetadata1);
    
    AddPath.UrlMetadata2 = Ext.extend(Curriki.ui.dialog.Bookmarklet, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('bookmarklet.add.setrequiredinfo.part2.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoScroll:true
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                text:_('bookmarklet.add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      this.close();
                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM1'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                text:_('bookmarklet.add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();
                      Curriki.current.sri2 = form.getValues(false);     
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                                       
                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM3'});
                      p.show();
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true
            ,items:[{
    // Education System
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-education_system'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-education_system-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.education_system_title')
                  },{
                    tag:'img'
                    ,id:'metadata-education_system-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.education_system_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-education_system-entry'
                ,hiddenName:'education_system'
                ,hideLabel:true
                ,width:250
                ,mode:'local'
                ,store:Curriki.data.education_system.store
                ,displayField:'education_system'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('bookmarklet.sri.education_system_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.current.sri.education_system?Curriki.current.sri.education_system:Curriki.data.education_system.initial
              }]
            },{
    // Language
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-language'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-language-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.language_title')
                  },{
                    tag:'img'
                    ,id:'metadata-language-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.language_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-language-entry'
                ,hiddenName:'language'
                ,hideLabel:true
                ,width:250
                ,mode:'local'
                ,store:Curriki.data.language.store
                ,displayField:'language'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('bookmarklet.sri.language_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.current.sri.language?Curriki.current.sri.language:Curriki.data.language.initial
              }]
            }]
          }]
        });
        
        AddPath.UrlMetadata2.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apUrlM2', AddPath.UrlMetadata2);
    
    AddPath.UrlMetadata3 = Ext.extend(Curriki.ui.dialog.Bookmarklet, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('bookmarklet.add.setrequiredinfo.part3.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,autoHeight:true
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoScroll:true
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                text:_('bookmarklet.add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                      
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.educational_level = this.findByType('curriki-treepanel')[0].getChecked('id');
                                            
                      this.close();
                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM2'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                text:_('bookmarklet.add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                      
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.educational_level = this.findByType('curriki-treepanel')[0].getChecked('id');
                                           
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM4'});                      
                      p.show();                      
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true
            ,items:[{
    // Educational Level
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'educational_level-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('el-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('el-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
                var checkedCount = 0;
                var elNodes = Curriki.ui.component.asset.filterTreeNodes(Curriki.data.el.elChildren, Curriki.current.sri.education_system);                
                var md = Curriki.current.sri;                
                if (md) {
                  var el = md.educational_level;                                 
                  Ext.isArray(el) && (function(ca){
                    var childrenFn = arguments.callee;
                    Ext.each(ca, function(c){
                      if (c.id) {
                        c.checked = (el.indexOf(c.id) !== -1);
                        if (c.checked) {
                          checkedCount++;
                        }
                        if (c.children) {
                          childrenFn(c.children);
                        }
                      }
                    });
                  })(elNodes);
                }
                return Ext.apply(AddPath.elTree = Curriki.ui.component.asset.getElTree(elNodes), {})
              })()] 
            }]
          }]   
        });
        
        AddPath.UrlMetadata3.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apUrlM3', AddPath.UrlMetadata3);
    
    AddPath.UrlMetadata4 = Ext.extend(Curriki.ui.dialog.Bookmarklet, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('bookmarklet.add.setrequiredinfo.part4.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,autoHeight:true
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                text:_('bookmarklet.add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                                          
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.fw_items = this.findByType('curriki-treepanel')[0].getChecked('id');
                      
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM3'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                text:_('bookmarklet.add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                                          
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.fw_items = this.findByType('curriki-treepanel')[0].getChecked('id');

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM5'});
                      p.show();
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true
            ,items:[{
    // Subjects
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'fw_items-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('fw_items-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('fw_items-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
                var checkedCount = 0;
                var fwNodes = Curriki.ui.component.asset.filterTreeNodes(Curriki.data.fw_item.fwChildren, Curriki.current.sri.educational_level);
                var md = Curriki.current.sri;
                if (md) {
                  var fw = md.fw_items;                
                  Ext.isArray(fw) && (function(ca){
                    var childrenFn = arguments.callee;
                    Ext.each(ca, function(c){
                      if (c.id) {
                        if (c.checked = (fw.indexOf(c.id) !== -1)) {
                          checkedCount++;
                        }
                        if (c.children) {
                          childrenFn(c.children);
                        }
                      }
                    });
                  })(fwNodes);
                }
                return Ext.apply(AddPath.fwTree = Curriki.ui.component.asset.getFwTree(fwNodes), {})
              })()]
            }]
          }]   
        });

        AddPath.UrlMetadata4.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apUrlM4', AddPath.UrlMetadata4);    
    
    
    
    AddPath.UrlMetadata5 = Ext.extend(Curriki.ui.dialog.Bookmarklet, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('bookmarklet.add.setrequiredinfo.part5.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,autoHeight:true
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoScroll:true
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                text:_('bookmarklet.add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                                          
                      Ext.apply(Curriki.current.sri, form.getValues(false));  
                      Curriki.current.sri.instructional_component = this.findByType('curriki-treepanel')[0].getChecked('id');
                      
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apUrlM4'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                text:_('bookmarklet.add.setrequiredinfo.publish.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                                          
                      Ext.apply(Curriki.current.sri, form.getValues(false));  
                      Curriki.current.sri.instructional_component = this.findByType('curriki-treepanel')[0].getChecked('id');

                      this.close();

                      AddPath.MetadataFinished();                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true
            ,items:[{
    // Instructional Component Type
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'instructional_component-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('ict-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('ict-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
                var checkedCount = 0;
                var md = Curriki.current.sri;
                if (md) {
                  var ict = md.instructional_component;
                  Ext.isArray(ict) && (function(ca){
                    var childrenFn = arguments.callee;
                    Ext.each(ca, function(c){
                      if (c.id) {
                        if (c.checked = (ict.indexOf(c.id) !== -1)) {
                          checkedCount++;
                        }
                        if (c.children) {
                          childrenFn(c.children);
                        }
                      }
                    });
                  })(Curriki.data.ict.ictChildren);
                }
                return Ext.apply(AddPath.ictTree = Curriki.ui.component.asset.getIctTree(), {})
              })()]
            }]
          }]   
        });

        AddPath.UrlMetadata5.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apUrlM5', AddPath.UrlMetadata5);
            
    
    AddPath.Metadata1 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part1.title')
          ,cls:'addpath addpath-metadata resource resource-add'          
          ,width:800
          ,items:[{
            xtype:'panel'
            ,cls:'guidingquestion-container'
            ,items:[{
              xtype:'box'
              ,autoEl:{
                tag:'div'
                ,html:_('add.setrequiredinfo.part1.guidingquestion')+' '+Curriki.data.user.me.fullname
                ,cls:'guidingquestion'
              }
            }]
          },{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.cancel.button')
                ,id:'cancelbutton'
                ,cls:'button button-cancel mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(){
                      // reset form values
                      Curriki.current.sri = {};
                      
                      this.close();
                      
                      //window.location.href = Curriki.current.cameFrom;
                    }
                    ,scope:this
                  }
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.part1.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                                          
                      if(!Curriki.current.sri)
                        Curriki.current.sri = form.getValues(false);
                      else
                        Ext.apply(Curriki.current.sri, form.getValues(false));                     

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apSRI2'});
                      p.show();
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
  // Title
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-title'
                  ,cls:'information-header information-header-required'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-title-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.title_title')
                  },{
                    tag:'img'
                    ,id:'metadata-title-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.title_tooltip')
                  }]
                }
              },{
                xtype:'textfield'
                ,id:'metadata-title-entry'
                ,name:'title'
                ,emptyText:_('bookmarklet.sri.title_content')
                ,allowBlank:false
                ,preventMark:true
                ,hideLabel:true
                ,width:'72%'
                ,value: Curriki.current.sri?Curriki.current.sri.title:Curriki.current.metadata?Curriki.current.metadata.title:''
              }]            
            },{
  // Description
              xtype:'container'
              ,cls:'metadata-entry'
              ,items:[{
                xtype:'textarea'
                ,id:'metadata-description-entry'
                ,name:'description'
                ,emptyText:_('bookmarklet.sri.description.empty_msg')
                ,allowBlank:false
                ,preventMark:true
                ,hideLabel:true
                ,value:Curriki.current.sri?Curriki.current.sri.description:Curriki.current.metadata?Curriki.current.metadata.description:''
                ,width:'98%'
              }]
            },{
  // Keywords
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype: 'box'
                ,autoEl: {
                  tag: 'div'
                  ,id: 'metadata-keywords'
                  ,cls: 'information-header'
                  ,children: [{
                    tag: 'span'
                    ,id: 'metadata-keywords-title'
                    ,cls: 'metadata-title'
                    ,html: _('bookmarklet.sri.keywords_title')
                  },{
                    tag: 'img'
                    ,id: 'metadata-keywords-info'
                    ,cls: 'metadata-tooltip'
                    ,src: Curriki.ui.InfoImg
                    ,qtip: _('bookmarklet.sri.keywords_tooltip')
                  }]
                }
              },{
                xtype: 'textfield'
                ,id: 'metadata-keywords-entry'
                ,name: 'keywords'
                ,emptyText: _('bookmarklet.sri.keywords.empty_msg')
                ,hideLabel: true
                ,width: '72%'
                ,value:Curriki.current.sri?Curriki.current.sri.keywords:Curriki.current.metadata?Curriki.current.metadata.keywords:''
                ,listeners: {
                  render: function(comp){
                    comp.findParentByType('apSRI1').on('show', function(){
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;
                        
                        if (!Ext.isEmpty(md.keywords)) {
                          if (Ext.isArray(md.keywords)) {
                            md.keywords = md.keywords.join(',');
                          }
                          Ext.getCmp('metadata-keywords-entry').setValue(md.keywords);
                        }
                      }
                    })
                  }
                }
              }]
            }]
          }]
        });

        AddPath.Metadata1.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSRI1', AddPath.Metadata1);


    AddPath.Metadata2 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part2.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                         
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apSRI1'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                         
                      Ext.apply(Curriki.current.sri, form.getValues(false));                   

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apSRI3'});
                      p.show();
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
  // Education System
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-education_system'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-education_system-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.education_system_title')
                  },{
                    tag:'img'
                    ,id:'metadata-education_system-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.education_system_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-education_system-entry'
                ,hiddenName:'education_system'
                ,hideLabel:true
                ,width:250
                ,mode:'local'
                ,store:Curriki.data.education_system.store
                ,displayField:'education_system'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('bookmarklet.sri.education_system_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.current.sri.education_system?Curriki.current.sri.education_system:Curriki.current.metadata?Curriki.current.metadata.education_system:Curriki.data.education_system.initial?Curriki.data.education_system.initial:undefined
              }]
            },{
  // Language
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-language'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-language-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.language_title')
                  },{
                    tag:'img'
                    ,id:'metadata-language-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.language_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-language-entry'
                ,hiddenName:'language'
                ,hideLabel:true
                ,width:250
                ,mode:'local'
                ,store:Curriki.data.language.store
                ,displayField:'language'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('bookmarklet.sri.language_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.current.sri.language?Curriki.current.sri.language:Curriki.current.metadata?Curriki.current.metadata.language:Curriki.data.language.initial
              }]
            }]
          }]
        });

        AddPath.Metadata2.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSRI2', AddPath.Metadata2);
    
    AddPath.Metadata3 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part3.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
               labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                                    
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.educational_level = this.findByType('curriki-treepanel')[0].getChecked('id');
                      
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apSRI2'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                                    
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.educational_level = this.findByType('curriki-treepanel')[0].getChecked('id');                     

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apSRI4'});
                      p.show();
                      Ext.ComponentMgr.register(p);                   
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
  // Educational Level
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'educational_level-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('el-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('el-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
                var checkedCount = 0;
                var elNodes = Curriki.ui.component.asset.filterTreeNodes(Curriki.data.el.elChildren, Curriki.current.sri.education_system);                
                var md = Curriki.current.sri.educational_level?Curriki.current.sri:Curriki.current.metadata;
                if (md) {
                  var el = md.educational_level;                                 
                  Ext.isArray(el) && (function(ca){
                    var childrenFn = arguments.callee;
                    Ext.each(ca, function(c){
                      if (c.id) {
                        c.checked = (el.indexOf(c.id) !== -1);
                        if (c.checked) {
                          checkedCount++;
                        }
                        if (c.children) {
                          childrenFn(c.children);
                        }
                      }
                    });
                  })(elNodes);
                }
                return Ext.apply(AddPath.elTree = Curriki.ui.component.asset.getElTree(elNodes), { })
              })()] 
            }]
          }]   
        });

        AddPath.Metadata3.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSRI3', AddPath.Metadata3);
    
    AddPath.Metadata4 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part4.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,autoScroll:false
          ,autoHeight:true
          ,resizable:false          
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
               labelSeparator:''
            }
            ,listeners: {
              resize: function(ct) {                
                var cmp = ct.ownerCt;
              }                     
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                                          
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.fw_items = this.findByType('curriki-treepanel')[0].getChecked('id');
                      
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apSRI3'});
                      p.show();
                    }
                  ,scope:this
                  }                  
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                                          
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.fw_items = this.findByType('curriki-treepanel')[0].getChecked('id');

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apSRI5'});
                      p.show();
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
  // Subjects
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'fw_items-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('fw_items-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('fw_items-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
                var checkedCount = 0;
                var fwNodes = Curriki.ui.component.asset.filterTreeNodes(Curriki.data.fw_item.fwChildren, Curriki.current.sri.educational_level);
                var md = Curriki.current.sri.fw_items?Curriki.current.sri:Curriki.current.metadata;
                if (md) {
                  var fw = md.fw_items;                
                  Ext.isArray(fw) && (function(ca){
                    var childrenFn = arguments.callee;
                    Ext.each(ca, function(c){
                      if (c.id) {
                        if (c.checked = (fw.indexOf(c.id) !== -1)) {
                          checkedCount++;
                        }
                        if (c.children) {
                          childrenFn(c.children);
                        }
                      }
                    });
                  })(fwNodes);
                }
                return Ext.apply(AddPath.fwTree = Curriki.ui.component.asset.getFwTree(fwNodes), { })
              })()]
            }]
          }]   
        });

        AddPath.Metadata4.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSRI4', AddPath.Metadata4);    
           
    AddPath.Metadata5 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part5.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
               labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                      
                      Ext.apply(Curriki.current.sri, form.getValues(false));  
                      Curriki.current.sri.instructional_component = this.findByType('curriki-treepanel')[0].getChecked('id');
                      
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apSRI4'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                      
                      Ext.apply(Curriki.current.sri, form.getValues(false));  
                      Curriki.current.sri.instructional_component = this.findByType('curriki-treepanel')[0].getChecked('id');

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apSRI6'});
                      p.show();
                      Ext.ComponentMgr.register(p);                   
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
  // Instructional Component Type
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'instructional_component-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                  if (!this.rendered || this.preventMark) {
                    return;
                  }
                  var fieldset = Ext.getCmp('ict-tree');
                  fieldset.removeClass('x-form-invalid');
                  fieldset.el.dom.qtip = '';
                }
                ,invalid:function(field, msg){
                  if (!this.rendered || this.preventMark) {
                    return;
                  }
                  var fieldset = Ext.getCmp('ict-tree');
                  fieldset.addClass('x-form-invalid');
                  var iMsg = field.invalidText;
                  fieldset.el.dom.qtip = iMsg;
                  fieldset.el.dom.qclass = 'x-form-invalid-tip';
                  if(Ext.QuickTips){ // fix for floating editors interacting with DND
                    Ext.QuickTips.enable();
                  }
                }
              }
            }
            ,(function(){
              var checkedCount = 0;
              var md = Curriki.current.sri.instructional_component?Curriki.current.sri:Curriki.current.metadata;
              if (md) {
                var ict = md.instructional_component;                
                Ext.isArray(ict) && (function(ca){
                  var childrenFn = arguments.callee;
                  Ext.each(ca, function(c){
                    if (c.id) {
                      if (c.checked = (ict.indexOf(c.id) !== -1)) {
                        checkedCount++;
                      }
                      if (c.children) {
                        childrenFn(c.children);
                      }
                    }
                  });
                })(Curriki.data.ict.ictChildren);
              }
              return Ext.apply(AddPath.ictTree = Curriki.ui.component.asset.getIctTree(), {})
            })()]
          }]
        }]   
      });

        AddPath.Metadata4.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSRI5', AddPath.Metadata5);
    
    
    AddPath.Metadata6 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part6.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      var form = this.findByType('form')[0].getForm();                      
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.hidden_from_search = this.findById('hidden_from_search-entry').getValue();
                      
                      this.close();
                      
                      var p = Ext.ComponentMgr.create({'xtype':'apSRI5'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.publish.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      var form = this.findByType('form')[0].getForm();                      
                      Ext.apply(Curriki.current.sri, form.getValues(false));
                      Curriki.current.sri.hidden_from_search = this.findById('hidden_from_search-entry').getValue();  

                      this.close();

                      AddPath.MetadataFinished();                   
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
    // Rights Holder(s)
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{             
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-right_holder'
                  ,cls:'information-header information-header-required'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-right_holder-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.right_holder_title')
                  },{
                    tag:'img'
                    ,id:'metadata-right_holder-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.right_holder_tooltip')
                  }]
                }
              },{
                xtype:'textfield'
                ,id:'metadata-right_holder-entry'
                ,name:'right_holder'
                ,hideLabel:true                
                ,allowBlank:false
                ,preventMark:true
                ,width:'60%'
                ,value:Curriki.current.sri.right_holder?Curriki.current.sri.right_holder:Curriki.current.metadata?Curriki.current.metadata.rightsHolder:Curriki.data.user.me.fullname                
              }]  
            },{
    // License Deed
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-license_type'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-license_type-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.license_type_title')
                  },{
                    tag:'img'
                    ,id:'metadata-license_type-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.license_type_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-license_type-entry'
                ,hiddenName:'license_type'
                ,hideLabel:true
                ,width:450
                ,mode:'local'
                ,store:Curriki.data.license.store
                ,displayField:'license'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('sri.license_type_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.current.sri.license_type?Curriki.current.sri.license_type:Curriki.current.metadata?Curriki.current.metadata.licenseType:Curriki.data.license.initial
              }]               
            },{
  // Access Privileges
              xtype:'container'
              ,cls:'metadata-entry'              
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-rights'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-rights-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.rights_title')
                  },{
                    tag:'img'
                    ,id:'metadata-rights-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.rights_tooltip')
                  }]
                }
              },{
                border:false
                ,xtype:'radiogroup'
                ,width:588
                ,columns:[.95]
                ,vertical:true
                ,defaults:{
                  name:'rights'
                }
                ,items:Curriki.data.rights.data
                ,value:Curriki.current.sri.rights?Curriki.current.sri.rights:Curriki.data.rights.initial                
              }]    
            },{
  // Hide from Search
              xtype:'container'
              ,cls:'metadata-entry'              
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-hidden_from_search'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-hidden_from_search-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.hidden_from_search_title')
                  },{
                    tag:'img'
                    ,id:'metadata-hidden_from_search-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.hidden_from_search_tooltip')
                  }]
                }
              },{
                xtype:'checkbox'
                ,id:'hidden_from_search-entry'
                ,name:'hidden_from_search'
                ,boxLabel:_('sri.hidden_from_search_after')                               
                ,checked:Curriki.current.sri.hidden_from_search?true:false
              }]
            }]
          }]
        });

        AddPath.Metadata6.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apSRI6', AddPath.Metadata6);
    
               
    AddPath.EditMetadata = {};
    AddPath.EditMetadata.SetMetadata = function(cmp){
      var form = cmp.findById('MetadataDialoguePanel').getForm();      
      if(!Curriki.current.sri)
        Curriki.current.sri = form.getValues(false);
      else                                   
        Ext.apply(Curriki.current.sri, form.getValues(false));
      if(cmp.findById('el-tree'))
        Curriki.current.sri.educational_level = cmp.findById('el-tree').getChecked('id');
      if(cmp.findById('fw_items-tree')) 
        Curriki.current.sri.fw_items = cmp.findById('fw_items-tree').getChecked('id');
      if(cmp.findById('ict-tree'))
        Curriki.current.sri.instructional_component = cmp.findById('ict-tree').getChecked('id');
    }
    
    AddPath.EditMetadata1 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part1.title')
          ,cls:'addpath addpath-metadata resource resource-add'          
          ,width:800
          ,items:[{
            xtype:'panel'
            ,cls:'guidingquestion-container'
            ,items:[{
              xtype:'box'
              ,autoEl:{
                tag:'div'
                ,html:_('add.setrequiredinfo.part1.guidingquestion')+' '+Curriki.data.user.me.fullname
                ,cls:'guidingquestion'
              }
            }]
          },{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.part1.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);                                                                               

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apESRI2'});
                      p.show();
                      Ext.ComponentMgr.register(p);
                    }
                    ,scope:this
                  }
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:__('add.setrequiredinfo.publish.button')
                ,id:'publishbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);   

                      this.close();

                      AddPath.EditMetadataFinished();                 
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
    // Title
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-title'
                  ,cls:'information-header information-header-required'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-title-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.title_title')
                  },{
                    tag:'img'
                    ,id:'metadata-title-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.title_tooltip')
                  }]
                }
              },{
                xtype:'textfield'
                ,id:'metadata-title-entry'
                ,name:'title'
                ,emptyText:_('bookmarklet.sri.title_content')
                ,allowBlank:false
                ,preventMark:true
                ,hideLabel:true
                ,width:'72%'
                ,value: Curriki.current.sri?Curriki.current.sri.title:''
              }]            
            },{
    // Description
              xtype:'container'
              ,cls:'metadata-entry'
              ,items:[{
                xtype:'textarea'
                ,id:'metadata-description-entry'
                ,name:'description'
                ,emptyText:_('bookmarklet.sri.description.empty_msg')
                ,allowBlank:false
                ,preventMark:true
                ,hideLabel:true
                ,value: Curriki.current.sri?Curriki.current.sri.description:''
                ,width:'98%'
              }]
            },{
    // Keywords
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype: 'box'
                ,autoEl: {
                  tag: 'div'
                  ,id: 'metadata-keywords'
                  ,cls: 'information-header'
                  ,children: [{
                    tag: 'span'
                    ,id: 'metadata-keywords-title'
                    ,cls: 'metadata-title'
                    ,html: _('bookmarklet.sri.keywords_title')
                  },{
                    tag: 'img'
                    ,id: 'metadata-keywords-info'
                    ,cls: 'metadata-tooltip'
                    ,src: Curriki.ui.InfoImg
                    ,qtip: _('bookmarklet.sri.keywords_tooltip')
                  }]
                }
              },{
                xtype: 'textfield'
                ,id: 'metadata-keywords-entry'
                ,name: 'keywords'
                ,emptyText: _('bookmarklet.sri.keywords.empty_msg')
                ,hideLabel: true
                ,width: '72%'
                ,value: Curriki.current.sri?Curriki.current.sri.keywords:''
                ,listeners: {
                  render: function(comp){
                    comp.findParentByType('apESRI1').on('show', function(){
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;
                          
                        if (!Ext.isEmpty(md.keywords)) {
                          if (Ext.isArray(md.keywords)) {
                            md.keywords = md.keywords.join(' ');
                          }
                          Ext.getCmp('metadata-keywords-entry').setValue(md.keywords);
                        }
                      }
                    })
                  }
                }
              }]
            }]
          }]
        });

        AddPath.Metadata1.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apESRI1', AddPath.EditMetadata1);


    AddPath.EditMetadata2 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part2.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      AddPath.EditMetadata.SetMetadata(this); 
                    
                      this.close();
                      var p = Ext.ComponentMgr.create({'xtype':'apESRI1'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);                   
  
                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apESRI3'});
                      p.show();
                      Ext.ComponentMgr.register(p);                 
                    }
                    ,scope:this
                  }
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.publish.button')
                ,id:'publishbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);  

                      this.close();

                      AddPath.EditMetadataFinished();                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
    // Education System
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-education_system'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-education_system-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.education_system_title')
                  },{
                    tag:'img'
                    ,id:'metadata-education_system-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.education_system_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-education_system-entry'
                ,hiddenName:'education_system'
                ,hideLabel:true
                ,width:250
                ,mode:'local'
                ,store:Curriki.data.education_system.store
                ,displayField:'education_system'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('bookmarklet.sri.education_system_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.current.sri.education_system?Curriki.current.sri.education_system:Curriki.data.education_system.initial?Curriki.data.education_system.initial:undefined
                ,listeners:{
                  render:function(comp){
                    comp.findParentByType('apESRI2').on('show', function() {
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;
                        if (!Ext.isEmpty(md.education_system)){
                          Ext.getCmp('metadata-education_system-entry').setValue(md.education_system);
                        }
                      }
                    })
                  }
                }
              }]
            },{
    // Language
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-language'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-language-title'
                    ,cls:'metadata-title'
                    ,html:_('bookmarklet.sri.language_title')
                  },{
                    tag:'img'
                    ,id:'metadata-language-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('bookmarklet.sri.language_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-language-entry'
                ,hiddenName:'language'
                ,hideLabel:true
                ,width:250
                ,mode:'local'
                ,store:Curriki.data.language.store
                ,displayField:'language'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('bookmarklet.sri.language_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.current.sri.language?Curriki.current.sri.language:Curriki.data.language.initial?Curriki.data.language.initial:undefined
                ,listeners:{
                  render:function(comp){
                    comp.findParentByType('apESRI2').on('show', function() {
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;
                        if (!Ext.isEmpty(md.language)){
                          Ext.getCmp('metadata-language-entry').setValue(md.language);
                        }
                      }
                    })
                  }
                }
              }]
            }]
          }]
        });

        AddPath.Metadata2.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apESRI2', AddPath.EditMetadata2);      
    
    AddPath.EditMetadata3 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part3.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      AddPath.EditMetadata.SetMetadata(this); 
                    
                      this.close();
                      var p = Ext.ComponentMgr.create({'xtype':'apESRI2'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);                    

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apESRI4'});
                      p.show();
                      Ext.ComponentMgr.register(p);                  
                    }
                    ,scope:this
                  }
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.publish.button')
                ,id:'publishbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);  

                      this.close();

                      AddPath.EditMetadataFinished();                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
    // Educational Level
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'educational_level-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('el-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('el-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
                var checkedCount = 0;
                var elNodes = Curriki.ui.component.asset.filterTreeNodes(Curriki.data.el.elChildren, Curriki.current.sri.education_system);                
                var md = Curriki.current.sri;                
                if (md) {
                  var el = md.educational_level;                                 
                  Ext.isArray(el) && (function(ca){
                    var childrenFn = arguments.callee;
                    Ext.each(ca, function(c){
                      if (c.id) {
                        c.checked = (el.indexOf(c.id) !== -1);
                        if (c.checked) {
                          checkedCount++;
                        }
                        if (c.children) {
                          childrenFn(c.children);
                        }
                      }
                    });
                  })(elNodes);
                }
                return Ext.apply(AddPath.elTree = Curriki.ui.component.asset.getElTree(elNodes), { })
              })()]  
            }]
          }]   
        });

        AddPath.Metadata3.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apESRI3', AddPath.EditMetadata3);
    
    AddPath.EditMetadata4 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part4.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,autoScroll:false
          ,autoHeight:true
          ,resizable:false          
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }            
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      AddPath.EditMetadata.SetMetadata(this);
                      
                      this.close();
                  
                      var p = Ext.ComponentMgr.create({'xtype':'apESRI3'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);                    

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apESRI5'});
                      p.show();
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.publish.button')
                ,id:'publishbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);   

                      this.close();

                      AddPath.EditMetadataFinished();                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
    // Subjects
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'fw_items-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('fw_items-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('fw_items-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
                var checkedCount = 0;
                var fwNodes = Curriki.ui.component.asset.filterTreeNodes(Curriki.data.fw_item.fwChildren, Curriki.current.sri.educational_level);
                var md = Curriki.current.sri;
                if (md) {
                  var fw = md.fw_items;                
                  Ext.isArray(fw) && (function(ca){
                    var childrenFn = arguments.callee;
                    Ext.each(ca, function(c){
                      if (c.id) {
                        if (c.checked = (fw.indexOf(c.id) !== -1)) {
                          checkedCount++;
                        }
                        if (c.children) {
                          childrenFn(c.children);
                        }
                      }
                    });
                  })(fwNodes);
                }
                return Ext.apply(AddPath.fwTree = Curriki.ui.component.asset.getFwTree(fwNodes), { })
              })()]
            }]
          }]   
        });

        AddPath.Metadata4.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apESRI4', AddPath.EditMetadata4);    
           
    AddPath.EditMetadata5 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part5.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      AddPath.EditMetadata.SetMetadata(this); 
                  
                      this.close();
                  
                      var p = Ext.ComponentMgr.create({'xtype':'apESRI4'});
                      p.show();
                    }
                    ,scope:this
                  }                  
                }
              },{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.next.button')
                ,id:'nextbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);                    

                      this.close();

                      var p = Ext.ComponentMgr.create({'xtype':'apESRI6'});
                      p.show();
                      Ext.ComponentMgr.register(p);                    
                    }
                    ,scope:this
                  }
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.publish.button')
                ,id:'publishbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);  

                      this.close();

                      AddPath.EditMetadataFinished();                   
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
    // Instructional Component Type
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                // A "TreeCheckBoxGroup" would be nice here
                xtype:'numberfield'
                ,id:'instructional_component-validation'
                ,allowBlank:false
                ,preventMark:true
                ,minValue:1
                ,hidden:true
                ,listeners:{
                  valid:function(field){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('ict-tree');
                    fieldset.removeClass('x-form-invalid');
                    fieldset.el.dom.qtip = '';
                  }
                  ,invalid:function(field, msg){
                    if (!this.rendered || this.preventMark) {
                      return;
                    }
                    var fieldset = Ext.getCmp('ict-tree');
                    fieldset.addClass('x-form-invalid');
                    var iMsg = field.invalidText;
                    fieldset.el.dom.qtip = iMsg;
                    fieldset.el.dom.qclass = 'x-form-invalid-tip';
                    if(Ext.QuickTips){ // fix for floating editors interacting with DND
                      Ext.QuickTips.enable();
                    }
                  }
                }
              }
              ,(function(){
              var checkedCount = 0;
              var md = Curriki.current.sri;
              if (md) {
                var ict = md.instructional_component;                
                Ext.isArray(ict) && (function(ca){
                  var childrenFn = arguments.callee;
                  Ext.each(ca, function(c){
                    if (c.id) {
                      if (c.checked = (ict.indexOf(c.id) !== -1)) {
                        checkedCount++;
                      }
                      if (c.children) {
                        childrenFn(c.children);
                      }
                    }
                  });
                })(Curriki.data.ict.ictChildren);
              }
              return Ext.apply(AddPath.ictTree = Curriki.ui.component.asset.getIctTree(), {})
            })()]
            }]
          }]   
        });

        AddPath.Metadata4.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apESRI5', AddPath.EditMetadata5);
    
    
    AddPath.EditMetadata6 = Ext.extend(Curriki.ui.dialog.Actions, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.setrequiredinfo.part6.title')
          ,cls:'addpath addpath-metadata resource resource-add'
          ,width:800
          ,items:[{
            xtype:'form'
            ,id:'MetadataDialoguePanel'
            ,formId:'MetadataDialogueForm'
            ,labelWidth:25
            ,autoHeight:true
            ,autoWidth:true
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:{
              xtype:'toolbar'
              ,layout:'xtoolbar'
              ,items:[{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.previous.button')
                ,id:'previousbutton'
                ,cls:'button button-previous mgn-rt'
                ,listeners:{
                  click:{
                    fn: function(e, ev){
                      AddPath.EditMetadata.SetMetadata(this);
                  
                      this.close();
                  
                      var p = Ext.ComponentMgr.create({'xtype':'apESRI5'});
                      p.show();
                    }
                    ,scope:this
                  }                   
                }
              },'->','->',{
                xtype: 'tbbutton'
                ,text:_('add.setrequiredinfo.publish.button')
                ,id:'publishbutton'
                ,cls:'button button-confirm'
                ,listeners:{
                  click:{
                    fn: function(){
                      AddPath.EditMetadata.SetMetadata(this);  

                      this.close();

                      AddPath.EditMetadataFinished();                    
                    }
                    ,scope:this
                  }
                }
              }]
            }
            ,monitorValid:true            
            ,items:[{
    // Rights Holder(s)
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{             
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-right_holder'
                  ,cls:'information-header information-header-required'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-right_holder-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.right_holder_title')
                  },{
                    tag:'img'
                    ,id:'metadata-right_holder-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.right_holder_tooltip')
                  }]
                }
              },{
                xtype:'textfield'
                ,id:'metadata-right_holder-entry'
                ,name:'right_holder'
                ,hideLabel:true
                ,value:Curriki.data.user.me.fullname
                ,allowBlank:false
                ,preventMark:true
                ,width:'60%'
                ,listeners:{
                  render:function(comp){
                    comp.findParentByType('apESRI6').on('show', function() {
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;

                        if (!Ext.isEmpty(md.rightsHolder)){
                          Ext.getCmp('metadata-right_holder-entry').setValue(md.rightsHolder);
                        }
                      }
                    })
                  }
                }
              }]  
            },{
    // License Deed
              xtype:'container'
              ,cls:'metadata-entry'
              ,layout:'column'
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-license_type'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-license_type-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.license_type_title')
                  },{
                    tag:'img'
                    ,id:'metadata-license_type-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.license_type_tooltip')
                  }]
                }
              },{
                xtype:'combo'
                ,id:'metadata-license_type-entry'
                ,hiddenName:'license_type'
                ,hideLabel:true
                ,width:450
                ,mode:'local'
                ,store:Curriki.data.license.store
                ,displayField:'license'
                ,valueField:'id'
                ,typeAhead:true
                ,triggerAction:'all'
                ,emptyText:_('sri.license_type_empty_msg')
                ,selectOnFocus:true
                ,forceSelection:true
                ,value:Curriki.data.license.initial?Curriki.data.license.initial:undefined
                ,listeners:{
                  render:function(comp){
                    comp.findParentByType('apESRI6').on('show', function() {
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;

                        if (!Ext.isEmpty(md.licenseType)){
                          Ext.getCmp('metadata-license_type-entry').setValue(md.licenseType);
                        }
                      }
                    })
                  }
                }
              }]               
            },{
    // Access Privileges
              xtype:'container'
              ,cls:'metadata-entry'              
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-rights'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-rights-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.rights_title')
                  },{
                    tag:'img'
                    ,id:'metadata-rights-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.rights_tooltip')
                  }]
                }
              },{
                border:false
                ,xtype:'radiogroup'
                ,width:588
                ,columns:[.95]
                ,vertical:true
                ,defaults:{
                  name:'rights'
                }
                ,items:Curriki.data.rights.data
                ,listeners:{
                  render:function(comp){
                    comp.findParentByType('apESRI6').on('show', function() {
                      if (!Ext.isEmpty(Curriki.current.metadata)) {
                        var md = Curriki.current.metadata;

                        if (!Ext.isEmpty(md.rights)){
                          Ext.getCmp(Ext.select('input[type="radio"][name="rights"][value="'+md.rights+'"]').first().dom.id).setValue(md.rights);
                        }
                      }
                    })
                  }
                }
              }]    
            },{
    // Hide from Search
              xtype:'container'
              ,cls:'metadata-entry'              
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,id:'metadata-hidden_from_search'
                  ,cls:'information-header'
                  ,children:[{
                    tag:'span'
                    ,id:'metadata-hidden_from_search-title'
                    ,cls:'metadata-title'
                    ,html:_('sri.hidden_from_search_title')
                  },{
                    tag:'img'
                    ,id:'metadata-hidden_from_search-info'
                    ,cls:'metadata-tooltip'
                    ,src:Curriki.ui.InfoImg
                    ,qtip:_('sri.hidden_from_search_tooltip')
                  }]
                }
              },{
                xtype:'checkbox'
                ,name:'hidden_from_search'
                ,boxLabel:_('sri.hidden_from_search_after')
                ,checked:Curriki.current.sri.hidden_from_search?true:false
              }]
            }]
          }]
        });

        AddPath.Metadata6.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apESRI6', AddPath.EditMetadata6);        
    
    AddPath.EditMetadataFinished = function(){
      // Save asset      
      // Display "Done" message

      var metadata = {};
      Ext.apply(metadata, Curriki.current.sri);
      /*
       * TODO Validation       
      if(Curriki.current.sri.educational_level.length == 0)
        Ext.apply(Curriki.current.sri.educational_level, Curriki.current.metadata.educational_level);         
      metadata.educational_level = [];
      if(Curriki.current.sri.fw_items.length == 0)
        Ext.apply(Curriki.current.sri.fw_items, Curriki.current.metadata.fw_items);
      metadata.fw_items = [];
      
      // validate
      Curriki.data.el.store.filter('system', metadata.education_system);
      Curriki.current.sri.educational_level.each(function(level){
        if(Curriki.data.el.store.find('id', level) != -1)
          metadata.educational_level.push(level);
      });
      if(metadata.educational_level.length == 0) {
        console.log('EDUCATIONAL LEVEL ERROR');        
        var p = Ext.ComponentMgr.create({'xtype':'apESRI3'});
        p.show();      
        return false; 
      }
      
      Curriki.data.fw_item.store.filterBy(function(record, id){
        var levels = record.data.level.split('|');
        var found = false;
        levels.each(function(item){
          if(metadata.educational_level.indexOf(item) != -1) {
            metadata.fw_items.push(id);
            found = true;
            return true;
          }          
        });        
        return found;        
      });
      if(metadata.fw_items.length == 0) {
        console.log('DISCIPLINES ERROR');        
        var p = Ext.ComponentMgr.create({'xtype':'apESRI4'});
        p.show();      
        return false; 
      }               
      */
     
      Curriki.assets.SetMetadata(
        Curriki.current.asset.assetPage
        ,metadata
        ,function(newMetadata) {
          console.log("SetMD CB: ", newMetadata);
          AddPath.ShowDone();          
        }
      );
    }
    
    AddPath.MetadataFinished = function(){
      // Save asset
      // Publish Asset
      // Set any items in Curriki.current as needed
      // Display "Done" message

      // Initial asset has been created
      // 1. Fill in metadata
      // 2. Publish asset
      // 3. Display "Done" message

      var metadata = Curriki.current.sri;

      Curriki.assets.SetMetadata(
        Curriki.current.asset.assetPage,
        metadata,
        function(newMetadata){
          console.log("SetMD CB: ", newMetadata);
          Curriki.assets.Publish(
            Curriki.current.asset.assetPage,
            Curriki.current.publishSpace,
            function(newAsset){
              console.log("Published CB: ", newAsset);
              Curriki.current.assetName = newAsset.assetPage;
              Curriki.current.asset.assetPage = newAsset.assetPage;
              Curriki.current.asset.assetType = newAsset.assetType;
              Curriki.current.asset.fullAssetType = newAsset.fullAssetType;
              Curriki.current.asset.title = newAsset.title;
              Curriki.current.asset.description = newAsset.description;

              if (Curriki.current.parentAsset){
                Curriki.assets.CreateSubasset(
                   Curriki.current.parentAsset
                  ,Curriki.current.assetName
                  ,-1
                  ,AddPath.ShowDone()
                );
              } else {
                AddPath.ShowDone();
              }
            }
          );          
        }
      );
    }

    AddPath.FinalLink = function(linkName){
    // Types of links to deal with:
    //   View - Need page created
    //   Add - Only shown if have collection available - Open CTV view
    //   Open in Currikulum Builder - Need page created
    //   View (Folder/Collection name) - Need page created
    //   "Continue >>" - ?
    //   Go to My Contributions - Go to this MyCurriki section
    //   Go to My Collections - 
    //   Go to My Favorites - 
    //   Close - Go to where we came from

      var link, text, handler, pageName, disabled;
      text = _('add.finalmessage.'+linkName+'.link');

      pageName = (Curriki.current.asset&&Curriki.current.asset.assetPage)||Curriki.current.assetName;

      disabled = false;

      switch(linkName) {
        case 'view':
          link = '/xwiki/bin/view/'+pageName.replace('.', '/');
          break;

        case 'add':
          // Is like starting from add path entry point E, J, or P (and sort of H)
          // Final message for add is per E

          // Start Content Tree View screen
          if (Curriki.data.user.collectionChildren.length > 0
            || Curriki.data.user.groupChildren.length > 0){
            handler = function(e,evt){
              Curriki.current.flow = 'E';
              Curriki.ui.show('apLocation');
              var sourceDlg = Ext.getCmp('done-dialogue');
              if (sourceDlg){
                sourceDlg.close();
              }
            }
          } else {
            disabled = true;
          }
          break;

        case 'viewtarget':
          link = '/xwiki/bin/view/'+pageName.replace('.', '/');
          text = _('add.finalmessage.viewtarget.link', (Curriki.current.assetTitle||(Curriki.current.sri1&&Curriki.current.sri1.title)||(Curriki.current.asset&&Curriki.current.asset.title)||'UNKNOWN'));
          break;

        case 'continue': // F, N, L Folder version
          link = Curriki.current.cameFrom;
          break;

        case 'contributions':
          link = '/xwiki/bin/view/MySankore/Contributions';
          break;

        case 'collections':
          link = '/xwiki/bin/view/MySankore/Collections';
          break;

        case 'favorites':
          link = '/xwiki/bin/view/MySankore/Favorites';
          break;

        case 'close':
          link = Curriki.current.cameFrom;
          break;
      }

      if (!handler) {
        handler = function(e,evt){
          window.location.href=link;
        }
      }

      return {
         text:text
        ,cls:'link'
        ,handler:handler
        ,hidden:disabled
      };
    }

    AddPath.DoneMessage = function(name){
      var msg;

      switch(Curriki.current.flow){
        case 'E':
        case 'H':
        case 'J':
        case 'P':
        case 'F':
        case 'N':
        case 'L':
        case 'FFolder':
        case 'NFolder':
        case 'LFolder':
          var msgArgs = [
            Curriki.current.assetTitle||(Curriki.current.sri1&&Curriki.current.sri1.title)||(Curriki.current.asset&&Curriki.current.asset.title)||'UNKNOWN'
            ,Curriki.current.parentTitle||'UNKNOWN'
          ];
          msg = '<p>'+_('add.finalmessage.text_'+name+'_success', msgArgs)+'</p>';
          break;

        case 'Copy':
          var msgArgs = [
            Curriki.current.copyOfTitle||'UNKNOWN'
            ,Curriki.current.assetTitle||(Curriki.current.sri1&&Curriki.current.sri1.title)||(Curriki.current.asset&&Curriki.current.asset.title)||'UNKNOWN'
          ];
          msg = '<p>'+_('add.finalmessage.text_'+name+'_success', msgArgs)+'</p>';
          break;

        default:
          msg = '<p>'+_('add.finalmessage.text_'+name+'_success')+'</p>';
          break;
      }

      switch(Curriki.current.flow){
        case 'K':
        case 'M':
          msg += _('add.finalmessage.text_'+name+'_tip1');
          break;
      }

      return {
         xtype:'box'
        ,autoEl:{
           tag:'div'
          ,cls:'done-message'
          ,html:msg
        }
      };
    }

    AddPath.CloseDone = function(dialog){
      return {
        text:_('add.finalmessage.close.button')
        ,id:'closebutton'
        ,cls:'button button-confirm'
        ,listeners:{
          click:{
            fn:function(e,evt){
              this.close();
              if (!Ext.isEmpty(Curriki.current.cameFrom)){
                window.location.href=Curriki.current.cameFrom;
              }
            }
            ,scope:dialog
          }
        }
      };
    }

    AddPath.DoneA = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_resource')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            AddPath.FinalLink('view'),'-'
            ,AddPath.FinalLink('add'),'-'
            ,AddPath.FinalLink('contributions'),'->'
            ,AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('resource')
          ]
        });
        AddPath.DoneA.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneA', AddPath.DoneA);
    Ext.reg('apDoneB', AddPath.DoneA);
    Ext.reg('apDoneD', AddPath.DoneA);
    Ext.reg('apDoneR', AddPath.DoneA);


    AddPath.DoneC = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_collection')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            AddPath.FinalLink('collections'),'->'
            ,AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('collection')
          ]
        });
        AddPath.DoneC.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneC', AddPath.DoneC);


    AddPath.DoneE = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_successful')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            '->',AddPath.CloseDone(this)
          ]
          ,items:[
            // This needs arguments for "added {0} into {1}"
            AddPath.DoneMessage('addto')
          ]
        });
        AddPath.DoneE.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneE', AddPath.DoneE);
    Ext.reg('apDoneH', AddPath.DoneE);
    Ext.reg('apDoneJ', AddPath.DoneE);
    Ext.reg('apDoneP', AddPath.DoneE);


    AddPath.DoneF = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_successful')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            '->',AddPath.CloseDone(this)
          ]
          ,items:[
            // This needs arguments for "added {0} into {1}"
            AddPath.DoneMessage('addto')
          ]
        });
        AddPath.DoneF.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneF', AddPath.DoneF);
    Ext.reg('apDoneN', AddPath.DoneF);
    Ext.reg('apDoneL', AddPath.DoneF);

    AddPath.DoneFFolder = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_folder')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            '->',AddPath.CloseDone(this)
          ]
          ,items:[
            // This needs arguments for "added {0} into {1}"
            AddPath.DoneMessage('addto_folder')
          ]
        });
        AddPath.DoneFFolder.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneFFolder', AddPath.DoneFFolder);
    Ext.reg('apDoneNFolder', AddPath.DoneFFolder);
    Ext.reg('apDoneLFolder', AddPath.DoneFFolder);


    AddPath.DoneG = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_successful')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            AddPath.FinalLink('favorites'),'->'
            ,AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('favorites')
          ]
        });
        AddPath.DoneG.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneG', AddPath.DoneG);

    AddPath.DoneK = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_collection')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            '->',AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('collection')
          ]
        });
        AddPath.DoneK.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneK', AddPath.DoneK);

    AddPath.DoneM = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_collection')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            '->',AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('groupcollection')
          ]
        });
        AddPath.DoneM.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneM', AddPath.DoneM);

    AddPath.DoneI = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_resource')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            AddPath.FinalLink('view'),'-'
            ,AddPath.FinalLink('add'),'->'
            ,AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('resource_simple')
          ]
        });
        AddPath.DoneI.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneI', AddPath.DoneI);
    Ext.reg('apDoneO', AddPath.DoneI);
    
    AddPath.AssetLink = function(linkMode) {
      var pageName = (Curriki.current.asset&&Curriki.current.asset.assetPage)||Curriki.current.assetName;
      var link = '/xwiki/bin/view/'+pageName.replace('.', '/');      
      return '<a href="http://'+XWiki.serverName+link+'" target="_blank" id="closebutton" style="width: auto;"><em unselectable="on" class=""><button type="button" class="btn x-btn-text ">'+ _('add.finalmessage.'+linkMode+'.link') +'</button></em></a>';    
    }
    
    AddPath.CloseLink = function() {
      return '<a href="" onclick="console.log(window.document);return false;">'+_('add.finalmessage.close.button')+'</a>';
    }
    
    AddPath.DoneBookmarklet = Ext.extend(Curriki.ui.dialog.Bookmarklet, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_resource')
          ,cls:'addpath addpath-done resource resource-add'
          ,draggable:false
          ,autoHeight:true
          ,bbar:[
            AddPath.AssetLink('view'),'->'
          ]
          ,items:[
            AddPath.DoneMessage('resource_simple')
          ]
        });
        AddPath.DoneBookmarklet.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneBookmarklet', AddPath.DoneBookmarklet);

    AddPath.DoneCopy = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_copied')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[
            AddPath.FinalLink('view'),'-'
            ,AddPath.FinalLink('add'),'-'
            ,AddPath.FinalLink('contributions'),'->'
            ,AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('copy')
          ]
        });
        AddPath.DoneCopy.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneCopy', AddPath.DoneCopy);

    AddPath.DoneMetadata = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        Ext.apply(this, {
          title:_('add.finalmessage.title_metadata')
          ,cls:'addpath addpath-done resource resource-add'
          ,bbar:[                     
            '->'
            ,AddPath.CloseDone(this)
          ]
          ,items:[
            AddPath.DoneMessage('metadata')
          ]
        });
        AddPath.DoneMetadata.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apDoneMetadata', AddPath.DoneMetadata);

    AddPath.ShowDone = function(){
      if (Ext.isEmpty(Curriki.current.flow)) {
        return;
      }
      
      // set status to DONE
      Ext.util.Cookies.set("assetStatus", "DONE")

      var pageCreated = (Curriki.current.asset&&Curriki.current.asset.assetPage)||Curriki.current.assetName;
      Curriki.logView('/features/resources/add/'+Curriki.current.flow+Curriki.current.flowFolder+'/'+((Curriki.current.asset&&Curriki.current.asset.assetType)||Curriki.current.assetType||'UNKNOWN')+'/'+pageCreated.replace('.', '/'));

      Curriki.init(function(){
        var p = Ext.ComponentMgr.create({
           xtype:'apDone'+Curriki.current.flow+Curriki.current.flowFolder
          ,id:'done-dialogue'
        });
        p.show();
        Ext.ComponentMgr.register(p);
      });
    }

    AddPath.ChooseLocation = Ext.extend(Curriki.ui.dialog.Messages, {
      initComponent:function(){
        var topChildren = [];
        if (Curriki.data.user.collectionChildren.length>0){
          topChildren.push({
            text:_('panels.myCurriki.myCollections')
            ,id:'ctv-drop-tree-collection-root'
            ,cls:'ctv-top ctv-header ctv-collections'
            ,leaf:false
            ,allowDrag:false
            ,allowDrop:true // Needed to auto-expand on hover
            ,disallowDropping:true // Disable drop on this node
            ,expanded:(Curriki.data.user.collectionChildren.length < 4)
            ,children:Curriki.data.user.collectionChildren
          });
        }
        if (Curriki.data.user.groupChildren.length>0){
          topChildren.push({
            text:_('panels.myCurriki.myGroups')
            ,id:'ctv-drop-tree-group-root'
            ,cls:'ctv-top ctv-header ctv-groups'
            ,leaf:false
            ,allowDrag:false
            ,allowDrop:true // Needed to auto-expand on hover
            ,disallowDropping:true // Disable drop on this node
            ,expanded:(Curriki.data.user.groupChildren.length < 4)
            ,children:Curriki.data.user.groupChildren
          });
        }

        Ext.apply(this, {
          id:'ChooseLocationDialogueWindow'
          ,title:_('add.chooselocation.title')
          ,cls:'addpath addpath-ctv resource resource-add'
          ,autoScroll:false
          ,width:500
          ,maxHeight:'auto'
          ,collapsible:true
          ,resizeable:true
          ,items:[{
            xtype:'panel'
            ,id:'guidingquestion-container'
            ,cls:'guidingquestion-container'
            ,items:[{
              xtype:'box'
              ,autoEl:{
                tag:'div'
                ,html:_('add.chooselocation.guidingquestion')
                ,cls:'guidingquestion'
              }
            },{
              xtype:'box'
              ,autoEl:{
                tag:'div'
                ,html:_('add.chooselocation.instruction')
                ,cls:'instruction'
              }
            }]
          },{
            xtype:'form'
            ,id:'ChooseLocationDialoguePanel'
            ,formId:'ChooseLocationDialogueForm'
            ,labelWidth:25
            ,autoScroll:false
            ,border:false
            ,defaults:{
              labelSeparator:''
            }
            ,bbar:[{
              text:_('add.chooselocation.cancel.button')
              ,id:'cancelbutton'
              ,cls:'button button-cancel mgn-rt'
              ,listeners:{
                click:{
                  fn: function(){
                    this.close();
                    window.location.href = Curriki.current.cameFrom;
                  }
                  ,scope:this
                }
              }
            },'->',{
              text:_('add.chooselocation.next.button')
              ,id:'nextbutton'
              ,cls:'button button-confirm'
              ,disabled:true
              ,listeners:{
                click:{
                  fn: function(){
                    AddPath.AddSubasset(function(){
                      var dlg = Ext.getCmp('ChooseLocationDialogueWindow');
                      if (dlg) {
                        dlg.close();
                      }
                      AddPath.ShowDone();
                    });
                  }
                  ,scope:this
                }
              }
            }]
            ,listeners:{
            }
            ,items:[{
    // DRAG BOX
              xtype:'panel'
              ,id:'resource-pickup'
              ,width:360
              ,border:false
              ,items:[{
                xtype:'box'
                ,autoEl:{
                  tag:'div'
                  ,html:_('add.chooselocation.instruction_short')
                  ,cls:'instruction'
                }
              },{
                xtype:'treepanel'
                ,loader: new Curriki.ui.treeLoader.Base()
                ,id:'ctv-from-tree-cmp'
                ,width:330
                ,useArrows:true
                ,autoScroll:false
                ,border:false
                ,cls:'ctv-from-tree'
                ,animate:true
                ,enableDrag:true
                ,rootVisible:false
                ,root: new Ext.tree.AsyncTreeNode({
                  text:_('add.chooselocation.pickup_root')
                  ,id:'ctv-drag-tree-root'
                  ,cls:'ctv-drag-root'
                  ,leaf:false
                  ,hlColor:'93C53C'
                  ,hlDrop:false
                  ,allowDrag:false
                  ,allowDrop:false
                  ,expanded:true
                  ,children:[{
                    text:(Curriki.current.asset&&Curriki.current.asset.title)||Curriki.current.assetTitle||'UNKNOWN'
                    ,id:'ctv-target-node'
                    ,assetName:(Curriki.current.asset&&Curriki.current.asset.assetPage)||Curriki.current.assetName
                    ,cls:'ctv-target ctv-resource resource-'+((Curriki.current.asset&&Curriki.current.asset.assetType)||Curriki.current.assetType||'UNKNOWN')
                    ,leaf:true
                  }]
                })
              }]

    // DROP TREE
            },{
              xtype:'panel'
              ,id:'resource-drop'
              ,border:false
              ,items:[{
                xtype:'treepanel'
                ,loader: new Curriki.ui.treeLoader.Base()
                ,id:'ctv-to-tree-cmp'
                ,autoScroll:true
                ,useArrows:true
                ,border:false
                ,hlColor:'93C53C'
                ,hlDrop:false
                ,cls:'ctv-to-tree'
                ,animate:true
                ,enableDD:true
                ,ddScroll:true
                ,containerScroll:true
                ,rootVisible:false
                ,listeners:{
                  nodedragover:{
                    fn: function(dragOverEvent){
                      var draggedNodeId = dragOverEvent.dropNode.attributes.assetName;
                      var parentNode = dragOverEvent.target;
                      if (dragOverEvent.point !== 'append') {
                        parentNode = parentNode.parentNode;
                        if (Ext.isEmpty(parentNode)) {
                          return false;
                        }
                      }

                      if (!Ext.isEmpty(parentNode.attributes.disallowDropping) && (parentNode.attributes.disallowDropping === true)) {
                        dragOverEvent.cancel = true;
                        return false;
                      }

                      var cancel = false;
                      while (!Ext.isEmpty(parentNode) && !cancel){
                        if (parentNode.id === draggedNodeId) {
                          cancel = true;
                          dragOverEvent.cancel = true;
                          return false;
                        } else {
                          parentNode = parentNode.parentNode;
                        }
                      }
                    }
                    ,scope:this
                  }
                  ,nodedrop:{
                    fn: function(dropEvent){
                      var targetNode = Ext.getCmp('ctv-to-tree-cmp').getNodeById('ctv-target-node');
                      var parentNode = targetNode.parentNode;
                      var parentNodeId = parentNode.id;
                      var nextSibling = targetNode.nextSibling;
                      var targetIndex = -1;
                      if (nextSibling){
                        targetIndex = nextSibling.attributes.order||-1;
                      }
                      Curriki.current.drop = {
                         parentPage:parentNodeId
                        ,targetIndex:targetIndex
                      };
                      Curriki.current.parentTitle = parentNode.text;
                      AddPath.EnableNext();
                    }
                    ,scope:this
                  }
                  ,expandnode:{
                    fn: function(node){
                      var wnd = this;
                      wnd.fireEvent('afterlayout', wnd, wnd.getLayout());
                    }
                    ,scope:this
                  }
                }
                ,root: new Ext.tree.AsyncTreeNode({
                  text:_('add.chooselocation.drop_root')
                  ,id:'ctv-drop-tree-root'
                  ,cls:'ctv-drop-root'
                  ,leaf:false
                  ,allowDrag:false
                  ,allowDrop:false
                  ,expanded:true
                  ,children:topChildren
                })
              }]
            }]
          }]
        });
        AddPath.ChooseLocation.superclass.initComponent.call(this);
      }
    });
    Ext.reg('apLocation', AddPath.ChooseLocation);

    AddPath.PostToTemplate = function(templateUrl){
      Curriki.assets.CreateAsset(Curriki.current.parentAsset, Curriki.current.publishSpace, function(asset){
        Curriki.current.asset = asset;
        var sf = new Ext.FormPanel({
           standardSubmit:true
          ,url:templateUrl
          ,method:'POST'
          ,onSubmit: Ext.emptyFn
          ,submit: function() {
            this.getForm().getEl().dom.action = this.getForm().url;
            this.getForm().getEl().dom.submit();
          }
          ,applyTo:Ext.getBody()
          ,cls:'x-hide-display'
          ,items:[
             {xtype:'hidden', name:'pageName', value:asset.assetPage}
            ,{xtype:'hidden', name:'cameFrom', value:Curriki.current.cameFrom}
            ,{xtype:'hidden', name:'flow', value:Curriki.current.flow}
            ,{xtype:'hidden', name:'parentPage', value:Curriki.current.parentAsset}
            ,{xtype:'hidden', name:'publishSpace', value:Curriki.current.publishSpace}
          ]
        });
        sf.submit();

        /*  Removed (CURRIKI-2230), We are going to a new page anyway
        var sourceDlg = Ext.getCmp(AddPath.AddSourceDialogueId);
        if (sourceDlg){
          sourceDlg.close();
        }
        */
      });
    }

    AddPath.PostFile = function(callback){
      Curriki.assets.CreateAsset(Curriki.current.parentAsset, Curriki.current.publishSpace, function(asset){
        Curriki.current.asset = asset;
        
        var progress = Ext.getCmp('file-progress-box');
        progress.show();
        var progresstip = Ext.getCmp('file-progress-tip');
        progresstip.show();

        Ext.Ajax.request({
          url:'/xwiki/bin/upload/'+asset.assetPage.replace('.', '/')
          ,isUpload:true
          ,form:'addDialogueForm'
          ,headers: {
            'Accept':'application/json'
          }          
          ,callback:function(options, success, response) {
            progress.hide();
            progresstip.hide();
            if (success) {
              Ext.Ajax.request({
                url: '/xwiki/bin/view/SankoreCode/ProcessAttachment?asset='+asset.assetPage
                ,callback:function(options, success, response){
                  callback(asset);
                }
              });
            } else {
              console.log('Upload failed', options, response);
              alert(_('add.servertimedout.message.text'));
            }
          }
        });
        
      });
    }

    AddPath.AddSubasset = function(callback){
      Curriki.assets.CreateSubasset(
        Curriki.current.drop.parentPage
        ,(Curriki.current.asset&&Curriki.current.asset.assetPage)||Curriki.current.assetName
        ,Curriki.current.drop.targetIndex
        ,function(){
          if ("function" === typeof callback){
            callback();
          }
        }
      );
    }

    AddPath.AddFavorite = function(callback){
      Curriki.assets.CreateSubasset(
        'Coll_'+Curriki.data.user.me.username.replace('XWiki.', '')+'.Favorites'
        ,Curriki.current.assetName
        ,-1
        ,function(){
          if ("function" === typeof callback){
            callback();
          }
        }
      );
    }

    AddPath.ShowNextDialogue = function(next, current){      

      if (!Ext.isEmpty(current)) {
        var closeDlg = Ext.getCmp(current);
        if (closeDlg){
          closeDlg.close();
        }
      }
      
      var p = Ext.ComponentMgr.create({xtype:next});
      p.show();
      Ext.ComponentMgr.register(p);
    }

    AddPath.SourceSelected = function(selected, allValues){      
      //Curriki.current.init();
      Curriki.current.sri = null;
      Curriki.current.sr1 = null;
      Curriki.current.selected = selected;

      var next;
      switch(selected) {
        case 'file':
          Curriki.current.fileName = allValues['filename'];
          next = 'apSRI1';
          AddPath.PostFile(function(asset){
            callback = function(){AddPath.ShowNextDialogue(next, AddPath.AddSourceDialogueId);};

            Curriki.assets.GetMetadata(asset.assetPage||Curriki.current.asset.assetPage, function(metadata){
              Curriki.current.metadata = metadata;
              callback();
            });
          });
          return;
          break;

        case 'video_upload':
        case 'video_capture':
          Curriki.current.videoId = allValues[selected+'-entry-value'];

          next = 'apSRI1';
          Curriki.assets.CreateAsset(
            Curriki.current.parentAsset,
            Curriki.current.publishSpace,
            function(asset){
console.log("CreateAsset (video) CB: ", asset);
              Curriki.current.asset = asset;

              Curriki.assets.CreateVIDITalk(
                asset.assetPage,
                Curriki.current.videoId,
                function(videoInfo){
console.log("Created viditalk CB: ", videoInfo);
                  callback = function(){AddPath.ShowNextDialogue(next, AddPath.AddSourceDialogueId);};
                  Curriki.assets.GetMetadata(asset.assetPage, function(metadata){
                    Curriki.current.metadata = metadata;
                    callback();
                  });
                }
              )
            }
          );
          return;
          break;

        case 'link':
          Curriki.current.linkUrl = allValues['link'];
          next = 'apSRI1';
          Curriki.assets.CreateAsset(
            Curriki.current.parentAsset,
            Curriki.current.publishSpace,
            function(asset){
console.log("CreateAsset (link) CB: ", asset);
              Curriki.current.asset = asset;

              Curriki.assets.CreateExternal(
                asset.assetPage,
                Curriki.current.linkUrl,
                function(linkInfo){
console.log("Created Link CB: ", linkInfo);
                  callback = function(){AddPath.ShowNextDialogue(next, AddPath.AddSourceDialogueId);};
                  Curriki.assets.GetMetadata(asset.assetPage, function(metadata){
                    Curriki.current.metadata = metadata;
                    callback();
                  });
                }
              )
            }
          );
          return;
          break;
          
        case 'url':
          Curriki.current.linkUrl = allValues['link'];
          next = 'apUrlM1';
          Curriki.assets.CreateAsset(
            Curriki.current.parentAsset,
            Curriki.current.publishSpace,
            function(asset){
              console.log("CreateAsset (link) CB: ", asset);
              Curriki.current.asset = asset;

              Curriki.assets.CreateExternal(
                asset.assetPage,
                Curriki.current.linkUrl,
                function(linkInfo){
                  console.log("Created Link CB: ", linkInfo);
                  callback = function(){AddPath.ShowNextDialogue(next, AddPath.AddSourceDialogueId);};
                  Curriki.assets.GetMetadata(asset.assetPage, function(metadata){
                    Curriki.current.metadata = metadata;
                    callback();
                  });
                }
              )
            }
          );
          return;
          break;

        case 'template':
          Curriki.current.templateType = 'template';
          if (AddPath.TemplateList().size() > 1) {
            next = 'apSelectTemplate';
          } else {
            AddPath.PostToTemplate(_('add.selecttemplate.list1.url'));
            return;
          }
          break;

        case 'scratch':
          Curriki.current.templateType = 'format';
          if (AddPath.TemplateList().size() > 1) {
            next = 'apSelectTemplate';
          } else {
            AddPath.PostToTemplate(_('add.selectformat.list1.url'));
            return;
          }
          break;

        case 'folder':
          next = 'apSRI1';
          Curriki.assets.CreateAsset(
            Curriki.current.parentAsset,
            Curriki.current.publishSpace,
            function(asset){
console.log("CreateAsset (folder) CB: ", asset);
              Curriki.current.asset = asset;

              Curriki.assets.CreateFolder(
                asset.assetPage,
                function(assetInfo){
console.log("Created Folder CB: ", assetInfo);
                  Curriki.current.flowFolder = 'Folder';
                  callback = function(){AddPath.ShowNextDialogue(next, AddPath.AddSourceDialogueId);};
                  Curriki.assets.GetMetadata(asset.assetPage, function(metadata){
                    Curriki.current.metadata = metadata;
                    callback();
                  });
                }
              )
            }
          );
          return;
          break;

        case 'collection': // Only from start
          next = 'apSRI1';
          Curriki.assets.CreateAsset(
            Curriki.current.parentAsset,
            Curriki.current.publishSpace,
            function(asset){
console.log("CreateAsset (collection) CB: ", asset);
              Curriki.current.asset = asset;

              Curriki.assets.CreateCollection(
                asset.assetPage,
                function(assetInfo){
console.log("Created Collection CB: ", assetInfo);
                  callback = function(){AddPath.ShowNextDialogue(next);};
                  Curriki.assets.GetMetadata(asset.assetPage, function(metadata){
                    Curriki.current.metadata = metadata;
                    callback();
                  });
                }
              )
            }
          );
          return;
          break;

        case 'toFavorites': // Only from start
          // Curriki.assets.{parentAsset,assetName} need to be set
          AddPath.AddFavorite(function(){
            Curriki.logView('/features/resources/favorites/'+Curriki.current.assetName.replace('.', '/'));
            AddPath.ShowDone();
          });
          return;
          break;

        case 'copy':
          next = 'apSRI1';
          Curriki.assets.CopyAsset(
            Curriki.current.copyOf,
            Curriki.current.publishSpace,
            function(asset){
                console.log("CopyAsset CB: ", asset);
                Curriki.current.asset = asset;
                callback = function(){AddPath.ShowNextDialogue(next);};
                Curriki.assets.GetMetadata(asset.assetPage, function(metadata){
                  Curriki.current.metadata = metadata;
                  callback();
                });
            }
          );
          return;
          break;
        case 'metadata':
          next = 'apESRI1';
          Curriki.assets.GetAssetInfo(Curriki.current.assetName, function(info){
            Curriki.current.asset = info;
            Curriki.assets.GetMetadata(Curriki.current.assetName, function(metadata){
              Curriki.current.metadata = metadata;
              Curriki.current.sri = metadata;
              AddPath.ShowNextDialogue(next);
            });
          })          
          return;
          break;

          


        default:
          // Should never get here
          next = 'apSRI1';
          break;
      }

      if (!Ext.isEmpty(next)){
        AddPath.ShowNextDialogue(next, AddPath.AddSourceDialogueId);
      }
    };


    AddPath.start = function(path){
  // Possible ways to start:
  // 1. Add on left navigation (give list of sources)
  // 2. Add a collection link - type is predetermined
  // 3. Add a resource (same as #1)
  // 4. Make a Resource From Scratch - goto from scratch from
  // 5. Make a Resource From a Template - goto template selection
  // 6. Add (viewing resource) - list collections to add to
  // 7. Build Up (viewing resource) - 8 options, destination already set
  // 8. Favorite - source and destination determined -- just add and show final
  // 9. Add (from favorites) - list collections to add to
  // 10. Add a Resource (contributions tab) - like #1
  // 11. Add (contributions tab) - like #6
  // 12. Add a collection (collections tab) - like #2
  // 13. Build up (collections tab) - like #7
  //
  // 14. Add a Group Collection (group collections) - like #2 but group space
  // 15. Build up (group collections) - like #7 but groups
  // 16. Add a resource (view all group contributions) - like #1 but groups
  // 17. Add (view all group contributions) - like #6 but groups
  //
  // 18. Add Template - Skip type selection and just show template selection

console.log('Starting path: ', path);

      // This should already have been handled, but do a simple test here
      if (Ext.isEmpty(Curriki.data.user.me) || 'XWiki.XWikiGuest' === Curriki.data.user.me.username){
console.log('Not signed in:');
        window.location.href='/xwiki/bin/login/XWiki/XWikiLogin?xredirect='+window.location.href;
        return;
      }

      // Defaults
      if (Ext.isEmpty(Curriki.current.cameFrom)) {
        Curriki.current.cameFrom = window.location.href;
      }

      if (!Ext.isEmpty(Curriki.current.parentAsset)
          && (Curriki.current.parentAsset.substr(0, 5) === 'Coll_')
      ) {
        var parentSpace = Curriki.current.parentAsset.replace(/\..*$/, '');
        Curriki.current.publishSpace = parentSpace;
      }
      if (Ext.isEmpty(Curriki.current.publishSpace)) {
        Curriki.current.publishSpace = 'Coll_'+Curriki.data.user.me.username.replace(/XWiki\./, '');
      }

      if (!Ext.isEmpty(path)) {
        Curriki.current.flow = path;
      }

      var pathParts = window.location.pathname.split('/');
      var pathSize = pathParts.size();
      Curriki.current.subPath = "";
      for (i = pathSize-2; i < pathSize; i++){
        Curriki.current.subPath += "/"+pathParts[i];
      }
      Curriki.logView('/features/resources/add/'+Curriki.current.flow+Curriki.current.subPath);

      switch (Curriki.current.flow){
        // Add a resource to unknown - no parent
        //case 'A': // From "Home Page" - removed from spec
        case 'B': // Left nav
        // case 'D-Add': // About Contributing page -- Really path B
        case 'I': // Add a Resource in MyCurriki Contributions
        case 'O': // Add a Resource in Group Curriculum View All Contribs
          Curriki.ui.show('apSource');
          return;
          break;

        // About Contributing page
        case 'D':
          // D.Add - Add a Resource -- Is really path B
          Curriki.current.flow = 'B';
          Curriki.ui.show('apSource');
          return;
          break;
        case 'D1':
          // D.1   - Make a resource from scratch form
          Curriki.current.flow = 'D';
          AddPath.SourceSelected('scratch', {});
          return;
          break;
        case 'D2':
          // D.2   - Make a Lesson Plan from a Template
          Curriki.current.flow = 'R';
          AddPath.SourceSelected('template', {});
          return;
          break;

        // Add a new collection
        case 'C': // About finding and collecting page
        case 'K': // Add a Collection in MyCurriki Collections
        case 'M': // Add a group collection in Group Collections listing
          // Create collection, then SRI
          AddPath.SourceSelected('collection', {});
          return;
          break;

        // Add Known (Existing) into a Target Collection or Folder
        case 'E': // Add in view
        case 'H': // Add in MyCurriki Favorites
        case 'J': // Add in MyCurriki Contributions
        case 'P': // Add in Group Curriculum View All Contributions
          // Need titles for current and parent assets in Done Msg
          // We should be getting the current one passed in
          // Shows CTV
          console.log('Starting path:', Curriki.current.flow);
          Curriki.ui.show('apLocation');
          return;
          break;

        // Add Known (Existing) into Favorites
        case 'G': // Favorite in view
          // Add asset as subasset in Favorites then show final dialogue
          AddPath.SourceSelected('toFavorites', {});
          return;
          break;

        // Add Unknown (New or Existing) into a Collection or Folder
        case 'F': // Build-up in view
        case 'L': // Build-up in MyCurriki Collections
        case 'N': // Build-up in Group Collections list
          // Need titles for new and parent assets in Done Msg
          // Parent known
          Curriki.ui.show('apSource', {toFolder:true, folderName:Curriki.current.parentTitle});
          return;
          break;

        // CURRIKI-2423
        // Add Template (choice already made)
        case 'R': // "Add From Template" in About Contributing page
          AddPath.SourceSelected('template', {});
          return;
          break;

        case 'Copy': // Copy an existing resource and allow metadata change
          AddPath.SourceSelected('copy', {});
          return;
          break;
          
        case 'Bookmarklet':
          AddPath.SourceSelected('url', {'link': Curriki.current.linkUrl})
          return;
          break;
        case 'Metadata':
          AddPath.SourceSelected('metadata');
          return;
          break;
      }
    }
    
    Curriki.module.addpath.group.init();

    Curriki.module.addpath.initialized = true;
  }
};

Curriki.module.addpath.startPath = function(path, options){
  Curriki.module.addpath.initAndStart(function(){
    Curriki.module.addpath.start(path);
  }, options);
}

Curriki.module.addpath.startDoneMessage = function(options){
  Curriki.module.addpath.initAndStart(function(){
    Curriki.module.addpath.ShowDone();
  }, options);
}

Curriki.module.addpath.initAndStart = function(fcn, options){
  // parentTitle needs to be passed for E, H, J, P, F, N, and L
  // assetTitle needs to be passed for E, H, J, P (known asset)

  var current = Curriki.current;
  if (!Ext.isEmpty(options)){
    current.assetName = options.assetName||current.assetName;
    current.parentAsset = options.parentAsset||current.parentAsset;
    current.publishSpace = options.publishSpace||current.publishSpace;
    current.copyOf = options.copyOf||current.copyOf;
    current.cameFrom = options.cameFrom||current.cameFrom;

    current.assetTitle = options.assetTitle||current.assetTitle;
    current.assetType = options.assetType||current.assetType;
    current.parentTitle = options.parentTitle||current.parentTitle;
    current.copyOfTitle = options.copyOfTitle||current.copyOfTitle;
    
    current.linkUrl = options.linkUrl;     
  }

  Curriki.init(function(){
    if (Ext.isEmpty(Curriki.data.user.me) || 'XWiki.XWikiGuest' === Curriki.data.user.me.username){
      window.location.href='/xwiki/bin/login/XWiki/XWikiLogin?xredirect='+window.location.href;
      return;
    }

    Curriki.module.addpath.init();

    var startFn = function(){
      fcn();
    }

    var parentFn;
    if (!Ext.isEmpty(current.parentAsset)
        && Ext.isEmpty(current.parentTitle)) {
      // Get parent asset info
      parentFn = function(){
        Curriki.assets.GetAssetInfo(current.parentAsset, function(info){
          Curriki.current.parentTitle = info.title;
          startFn();
        });
      }
    } else {
      parentFn = function(){
        startFn();
      };
    }

    var copyOfFn;
    if (!Ext.isEmpty(current.copyOf)
        && Ext.isEmpty(current.copyOfTitle)) {
      // Get parent asset info
      copyOfFn = function(){
        Curriki.assets.GetAssetInfo(current.copyOf, function(info){
          Curriki.current.copyOfTitle = info.title;
          parentFn();
        });
      }
    } else {
      copyOfFn = function(){
        parentFn();
      };
    }

    var currentFn;
    if (!Ext.isEmpty(current.assetName)
        && (Ext.isEmpty(current.assetTitle)
            || Ext.isEmpty(current.assetType))) {
      // Get asset info
      currentFn = function(){
        Curriki.assets.GetAssetInfo(current.assetName, function(info){
          Curriki.current.assetTitle = info.title;
          Curriki.current.assetType = info.assetType;
          copyOfFn();
        });
      }
    } else {
      currentFn = function(){
        copyOfFn();
      };
    }

    currentFn();
  });
}

Curriki.module.addpath.loaded = true;