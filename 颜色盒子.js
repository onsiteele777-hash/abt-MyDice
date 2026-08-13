// ==UserScript==
// @name         颜色盒子
// @version      1.2.0
// @author       偷电
// @description  随机生成一张颜色图片，本意为draw颜色图片的代餐，扩展了几个定向搜索，新增调色盘组合
// ==/UserScript==

let ext = seal.ext.find("colorbox");
if (!ext) 
{
    ext = seal.ext.new("colorbox","偷电","1.2.0");
    seal.ext.register(ext);
}

function rand(min, max) //随机整数
{
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomColor(type) //颜色生成
{
    let r, g, b;

    if (type === "红色") 
    {
        r = rand(150, 255);
        g = rand(0, 100);
        b = rand(0, 100);
    }

    else if (type === "绿色") 
    {
        r = rand(0, 100);
        g = rand(150, 255);
        b = rand(0, 100);
    }

    else if (type === "蓝色") 
    {
        r = rand(0, 100);
        g = rand(0, 100);
        b = rand(150, 255);
    }

    else if (type === "暗色") 
    {
        r = rand(0, 70);
        g = rand(0, 70);
        b = rand(0, 70);
    }

    else if (type === "亮色") 
    {
        r = rand(180, 255);
        g = rand(180, 255);
        b = rand(180, 255);
    }

    else if (type === "粉色") 
    {
        r = rand(200, 255);
        g = rand(50, 150);
        b = rand(100, 180);
    }

    else if (type === "橙色") 
    {
        r = rand(200, 255);
        g = rand(100, 180);
        b = rand(0, 60);
    }

    else if (type === "黄色") 
    {
        r = rand(200, 255);
        g = rand(180, 255);
        b = rand(0, 80);
    }

    else if (type === "紫色") 
    {
        r = rand(150, 220);
        g = rand(0, 80);
        b = rand(180, 255);
    }

    else if (type === "青色") 
    {
        r = rand(0, 80);
        g = rand(180, 255);
        b = rand(180, 255);
    }

    else if (type === "棕色") 
    {
        r = rand(130, 190);
        g = rand(70, 130);
        b = rand(20, 80);
    }

    else if (type === "灰色") 
    {
        let v = rand(100, 200);
        r = v + rand(-20, 20);
        g = v + rand(-20, 20);
        b = v + rand(-20, 20);
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
    }

    else if (type === "霓虹色") 
    {
        let choice = rand(0, 2);
        if (choice === 0) 
            { 
                r = 255; 
                g = rand(0, 50); 
                b = rand(0, 50); 
            }
        else if (choice === 1) 
            { 
                r = rand(0, 50); 
                g = 255; 
                b = rand(0, 50); 
            }
        else 
            { 
                r = rand(0, 50); 
                g = rand(0, 50); 
                b = 255; 
            }
    }

    else if (type === "马卡龙色") 
    {
        let base = rand(180, 235); 
        r = base + rand(-20, 20);
        g = base + rand(-20, 20);
        b = base + rand(-20, 20);
        r = Math.min(255, Math.max(180, r));
        g = Math.min(255, Math.max(180, g));
        b = Math.min(255, Math.max(180, b));
    }

    else if (type === "奶油色") 
    {
        r = rand(235, 255);
        g = rand(215, 245);
        b = rand(180, 220); 
    }

    else if (type === "莫兰迪色") 
    {
        let base = rand(120, 190); 
        r = base + rand(0, 40);
        g = base + rand(0, 40);
        b = base + rand(0, 40);
        r = Math.min(230, r); 
        g = Math.min(230, g); 
        b = Math.min(230, b);
    }

    else 
    {
        r = rand(0, 255);
        g = rand(0, 255);
        b = rand(0, 255);
    }

    return "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0");

}

function generatePalette(count=4)//调色盘生成
{
    //排除五色调和中性色的色系池
    const pool = ["红色", "粉色", "橙色", "黄色", "绿色", "青色", "蓝色",
         "紫色", "棕色", "霓虹色", "奶油色", "马卡龙色", "莫兰迪色"];

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, pool.length));
    return selected.map(name => ({name: name,hex: randomColor(name)}));
}

function help() //窗口指令
{
    return `
【ColorBox】颜色盒子v1.2.0
.cb help -查看帮助
.cb -抽取一个随机颜色
-可额外选择抽取：
    红色、绿色、蓝色、黄色、暗色、亮色、粉色、青色、橙色、紫色、棕色、灰色、霓虹色、奶油色、马卡龙色、莫兰迪色
.cb 组合 [数量]
    -生成一组调色盘，默认为4个，可填范围为2~6个
`;
}
/*
.cb 蓝色 -抽取一个随机蓝色
.cb 绿色 -抽取一个随机绿色
.cb 暗色 -抽取一个随机暗色
.cb 亮色 -抽取一个随机亮色
*/

const cmd = seal.ext.newCmdItemInfo();
cmd.name = "cb";
cmd.help = "随机颜色";

cmd.solve = function (ctx, msg, args) 
{
    let arg = args.getArgN(1);
    let arg2 = args.getArgN(2);
    
    if (arg === "help" ||arg === "帮助") 
    {
        seal.replyToSender(ctx,msg,help());
        return seal.ext.newCmdExecuteResult(true);
    }

    if (arg === "组合" || arg === "调色盘" || arg === "palette") 
    {
        let count = 4; 
        if (arg2) 
        {
            let num = parseInt(arg2, 10);
            if (!isNaN(num) && num >= 2 && num <= 6) 
            {
                count = num;
            }
        }
        const palette = generatePalette(count);

        let reply = `🎨 调色盘（共${palette.length}色）：\n`;
        let images = [];
        palette.forEach((item, index) => 
        {
            const hex = item.hex;
            const imgUrl = `https://singlecolorimage.com/get/${hex.substring(1)}/300x300`;
            reply += `${index+1}. ${item.name}：${hex}\n`;
            images.push(`[CQ:image,file=${imgUrl}]`);
        });
     
        reply += images.join('\n');
        seal.replyToSender(ctx, msg, reply);
        return seal.ext.newCmdExecuteResult(true);
    }

     
        let color = randomColor(arg);
        let name = ctx.player.name || "玩家";
        let img = "https://singlecolorimage.com/get/"+color.substring(1)+"/300x300";
        seal.replyToSender(ctx,msg,`<${name}>抽到了颜色\nHEX:${color}\n[CQ:image,file=${img}]`);
    
        return seal.ext.newCmdExecuteResult(true);

};

ext.cmdMap["cb"] = cmd;