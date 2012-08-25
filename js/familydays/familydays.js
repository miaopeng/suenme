/**
 * Family Days Calendar
 * @author mios<peng.mios@gmail.com>
 * TODO album style UI 
 */
KISSY.add('familydays', function(S, undefined){
    var DOM = S.DOM, 
    family = [
    	// TODO handle luna dates
        {name:'grandma',m:8,d:22},
        {name:'guodong',m:1,d:28,lm:12,ld:26},
        {name:'yucui',  m:7,d:11,lm:5,ld:21},
        {name:'guohua',m:9,d:11},
        {name:'zhixin', lm:10,ld:8},
        {name:'guojing', m:11,d:1},
        {name:'jinfu',  m:5,d:30},
        {name:'yan',    m:8,d:10,lm:7,ld:9},
        {name:'peng',   m:2,d:5,lm:12,ld:18},
        {name:'hong',   m:2,d:6,lm:12,ld:19},
        {name:'yu',     m:2,d:3,lm:12,ld:23},
        {name:'keke',   m:11,d:25,lm:10,ld:5},
        {name:'yiyi',   m:1,d:11},
        {name:'tao',    m:7,d:31},
        {name:'ling',   m:5,d:8},
        {name:'yaoyao', m:3,d:21},
        {name:'mei',    m:1,d:28},
        {name:'jingchang', m:3,d:29},
        {name:'tiancui',m:12,d:4},
        {name:'fengcui',lm:5,ld:16},
        {name:'kekegm', lm:2,ld:2},
        {name:'kekegp', lm:1,ld:17}
    ];

    S.familydays = function(calendar){
        if(!calendar) return;

        return {
            
            init : function(){
                calendar.con.on('mouseover mouseout', function(e){
                    var target = e.target;
                    if(DOM.hasClass(target, 'birthday')){
                        var info = target.one('.info');
                        if(e.type == 'mouseover'){
                            info.removeClass('hidden');
                        }
                        if(e.type == 'mouseout'){
                            info.addClass('hidden');               
                        }
                    }
                })
            },
            
            update : function(){
                // detach click event
                try{ calendar.ca[0].EV[0].detach(); }catch(e){}

                var cells = calendar.con.one('div.ks-dbd').children('a');

                // add birthdays
                S.each(family, function(person){
                    if(person.m !== undefined && calendar.month+1 === person.m){
                        S.each(cells, function(cell){

                            if( person.d === Number(cell.innerHTML) ){
                                if(!DOM.hasClass(cell, 'birthday')){
                                    DOM.addClass(cell, 'birthday');
                                    DOM.addClass(cell, person.name);
                                    DOM.data(cell, 'data-birthday', person.name);
                                }
                                else{ // TODO duplicate birthday
                                    DOM.data(cell, 'data-birthday', DOM.data(cell, 'data-birthday')+' '+person.name);
                                }
                                
                                cell.innerHTML = 
                                    '<div class=\"info hidden\"><span>'
                                       + person.name + ' 生日: ' + person.m+'.'+person.d
                                       +'</span><span class=\"arrow inner\"></span><span class=\"arrow outer\"></span></div>';
                                S.log('add '+person.name);
                                             
                            }

                        }) // end of each
                    }
                });
            } // end of update
        } // end of return
        
    };

    // TODO merge with calendar module
}, { requires:['calendar'] })
