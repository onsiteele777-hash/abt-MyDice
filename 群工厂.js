// ==UserScript==
// @name         群工厂
// @version      1.0
// @author       偷电
// @description  十分强大的群工厂功能，没事灭绝一下群u
// ==/UserScript==

let ext = seal.ext.find('GroupFactory');
if (!ext) 
{
  ext = seal.ext.new('GroupFactory', '偷电', '1.0');
  seal.ext.register(ext);
}

const ovenState = 
{
  isOn: false,
  mode: '冷冻',
  modes: ['冷冻', '烧烤', '蒸煮', '冷藏', '火化', '碳化', '冶铁', '灭绝'],
  temperature: 0,
  minTemp: -1000000000,
  maxTemp: 10000000000
};

function turnOn() 
{
  if (ovenState.isOn) return '【工厂】工厂已经开始工作了！';
  ovenState.isOn = true;
  ovenState.temperature = ovenState.minTemp;
  return `【工厂】工厂开始运行！初始厂间温度设置为${ovenState.temperature}°C，模式为${ovenState.mode}。`;
}

function turnOff() 
{
  if (!ovenState.isOn) return '【工厂】工厂已经下班了！';
  ovenState.isOn = false;
  ovenState.temperature = 0;
  return '【工厂】工厂已经下班了！';
}

function setMode(arg) 
{
  if (!ovenState.isOn) return '【工厂】请先开启今天的工作！';
  if (!arg) 
  {
    const i = ovenState.modes.indexOf(ovenState.mode);
    ovenState.mode = ovenState.modes[(i + 1) % ovenState.modes.length];
    return `【工厂】已切换为${ovenState.mode}模式！`;
  }
  if (ovenState.modes.includes(arg)) 
  {
    ovenState.mode = arg;
    return `【工厂】已设置为${arg}模式！`;
  }
  return `【工厂】暂时没有这项业务！可用模式：${ovenState.modes.join('、')}`;
}

function setTemp(arg) 
{
  if (!ovenState.isOn)  
    return '【工厂】请先开始今天的工作！';
  if (!arg)  
    return `【工厂】当前厂间温度为${ovenState.temperature}°C`;

  if (arg.startsWith('+') || arg.startsWith('-')) 
  {
    const change = parseInt(arg);
    if (isNaN(change))   
    return '【烤箱】请输入有效的变化值';
    return updateTemp(ovenState.temperature + change,
      `【工厂】温度已${change > 0 ? '升高' : '降低'}${Math.abs(change)}°C`);
  }

  const abs = parseInt(arg);
  if (isNaN(abs)) 
    return '【工厂】请输入有效的温度值';
    return updateTemp(abs, `【工厂】温度已设置为${abs}°C`);
}

function updateTemp(t, msg) {
  if (t < ovenState.minTemp) 
    return `【工厂】温度不能低于${ovenState.minTemp}°C`;
  if (t > ovenState.maxTemp) 
    return `【工厂】温度不能高于${ovenState.maxTemp}°C`;
  ovenState.temperature = t;
  return msg;
}

function showStatus() 
{
  if (!ovenState.isOn)
    return '【厂间状态】\n状态：关闭\n温度：--\n模式：--';
    return `【厂间状态】\n状态：运行中\n模式：${ovenState.mode}\n温度：${ovenState.temperature}°C\n温度范围：${ovenState.minTemp}°C ~ ${ovenState.maxTemp}°C`;
}

function showHelp() 
{
  return `【GroupFactory】群工厂v1.0\n`
    + `.开工厂 - 打开群内工厂\n`
    + `.关工厂 - 关闭群内工厂\n`
    + `.模式 [冷冻|烧烤|蒸煮|冷藏|火化|碳化|冶铁|灭绝] -切换模式\n`
    + `.温度 (+|-)<值> -调整温度\n`
    + `.设置温度 <值> -设置温度\n`
    + `.工厂 -查看状态\n`
    + `.工厂 help|帮助 -查看本菜单`;
}


function regCmd(name, help, func) 
{
  const cmd = seal.ext.newCmdItemInfo();
  cmd.name = name;
  cmd.help = help;
  cmd.solve = (ctx, msg, cmdArgs) => {
    const arg = cmdArgs.getArgN(1);
    seal.replyToSender(ctx, msg, func(arg));
    return seal.ext.newCmdExecuteResult(true);
  };
  ext.cmdMap[name] = cmd;
}

regCmd('开工厂', '打开群内工厂', () => turnOn());
regCmd('关工厂', '关闭群内工厂', () => turnOff()); 
regCmd('模式', '设置/切换工厂模式', (arg) => setMode(arg));
regCmd('温度', '设置/调整温度', (arg) => setTemp(arg));
regCmd('工厂', '查看工厂状态', (arg) => {
  if (arg === 'help' || arg === '帮助') 
    return showHelp();
    return showStatus();
});