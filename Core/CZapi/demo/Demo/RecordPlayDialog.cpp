// RecordPlay.cpp : 实现文件
//

#include "stdafx.h"
#include "Demo.h"
#include "RecordPlayDialog.h"
#include "afxdialogex.h"
// CRecordPlay 对话框

IMPLEMENT_DYNAMIC(CRecordPlayDialog, CDialog)

CRecordPlayDialog::CRecordPlayDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_PLAYBACK, pParent)
	, _url(_T(""))
	, _snapPicFile(_T(""))
	, _volume(0)
	, _osdX(0)
	, _osdY(0)
	, _osdFontSize(0)
	, _osdR(0)
	, _osdG(0)
	, _osdB(0)
	, _osdAlignType(0)
	, _osdText(_T(""))
	, _localRecordType(0)
	, _localRecordFile(_T(""))
	, _streamInfo(_T(""))
	, _yuvInfo(_T(""))
	, _isFontBold(0)
	, _curPlayTimeStamp(0)
	, _timeStampToSeek(0)
	, _volumeToSet(0)
	, _speed(0)
	, _packageSize(1024 * 1024 * 500)
	, _privateMainType(0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020)
	, _privateSubType(0)
{

}

CRecordPlayDialog::~CRecordPlayDialog()
{
}

void CRecordPlayDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT_RECORD_URL, _url);
	DDX_Text(pDX, IDC_EDIT_RECORD_SNAL_FILE, _snapPicFile);
	DDX_Text(pDX, IDC_EDIT_RECORD_VOLUME, _volume);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_X, _osdX);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_Y, _osdY);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_FONTSIZE, _osdFontSize);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_R, _osdR);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_G, _osdG);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_B, _osdB);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_ALIGN, _osdAlignType);
	DDX_Control(pDX, IDC_COMBO_RECORD_OSD_ID, _osdCombBox);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_TEXT, _osdText);
	DDX_Text(pDX, IDC_EDIT_RECORD_LOCALRECORD_TYPE, _localRecordType);
	DDX_Text(pDX, IDC_EDIT_RECORD_LOCAL_FILE, _localRecordFile);
	DDX_Control(pDX, IDC_LIST_PLAYBACK_MSGBOX, _msgBox);
	DDX_Control(pDX, IDC_STATIC_PLAYBACK_PLAYWND, _recordPlayWnd);
	DDX_Text(pDX, IDC_EDIT_RECORD_STREAM, _streamInfo);
	DDX_Text(pDX, IDC_EDIT_RECORD_YUV, _yuvInfo);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_STARTDATE, _startDate);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_STARTTIME, _startTime);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_ENDDATE, _endDate);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_ENDTIME, _endTime);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_BOLD, _isFontBold);
	DDX_Text(pDX, IDC_EDIT_RECORD_CUR_PLAYTIMESTAMP, _curPlayTimeStamp);
	DDX_Text(pDX, IDC_EDIT_RECORD_TIMESTAP_TOSEEK, _timeStampToSeek);
	DDX_Text(pDX, IDC_EDIT_RECORD_VOLUME_TOSET, _volumeToSet);
	DDX_Text(pDX, IDC_EDIT_RECORD_PARAM, _speed);
	DDX_Text(pDX, IDC_EDIT_RECORD_PACKAGESIZE, _packageSize);
	DDX_Text(pDX, IDC_EDIT_RECORD_MAINTYPE, _privateMainType);
	DDX_Text(pDX, IDC_EDIT_RECORD_SUBTYPE, _privateSubType);
}

BOOL CRecordPlayDialog::PreTranslateMessage(MSG * pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}


BEGIN_MESSAGE_MAP(CRecordPlayDialog, CDialog)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_START, &CRecordPlayDialog::OnBnClickedButtonRecordStart)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_STOP, &CRecordPlayDialog::OnBnClickedButtonRecordStop)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SNAP, &CRecordPlayDialog::OnBnClickedButtonRecordSnap)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_OPENSOUND, &CRecordPlayDialog::OnBnClickedButtonRecordOpensound)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_CLOSESOUND, &CRecordPlayDialog::OnBnClickedButtonRecordClosesound)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_VIDEO_DETAIL, &CRecordPlayDialog::OnBnClickedButtonRecordVideoDetail)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_GETVOLUME, &CRecordPlayDialog::OnBnClickedButtonRecordGetvolume)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SETVOLUME, &CRecordPlayDialog::OnBnClickedButtonRecordSetvolume)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SETOSD, &CRecordPlayDialog::OnBnClickedButtonRecordSetosd)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_START_LOCALRECORD, &CRecordPlayDialog::OnBnClickedButtonRecordStartLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_STOP_LOCALRECORD, &CRecordPlayDialog::OnBnClickedButtonRecordStopLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_PAUSE, &CRecordPlayDialog::OnBnClickedButtonRecordPause)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_RESUME, &CRecordPlayDialog::OnBnClickedButtonRecordResume)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_GETTIMESTAMP, &CRecordPlayDialog::OnBnClickedButtonRecordGettimestamp)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SEEK, &CRecordPlayDialog::OnBnClickedButtonRecordSeek)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SPEED, &CRecordPlayDialog::OnBnClickedButtonRecordSpeed)
	ON_LBN_DBLCLK(IDC_LIST_PLAYBACK_MSGBOX, &CRecordPlayDialog::OnLbnDblclkListPlaybackMsgbox)
	ON_MESSAGE(MSG_UPDATE_CALLBACKINFO, &CRecordPlayDialog::OnUpdateCallbackInfo)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_PRIVATE_OPEN, &CRecordPlayDialog::OnBnClickedButtonRecordPrivateOpen)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_PRIVATE_CLOSE, &CRecordPlayDialog::OnBnClickedButtonRecordPrivateClose)
END_MESSAGE_MAP()

void CRecordPlayDialog::NotifyDialogInited(const char* exeFolder)
{
	_exefold = nullptr == exeFolder ? "" : exeFolder;
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
	_toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_GPU), L"是否启用GPU硬解，勾选启用，否则不启用，注意开启硬解后无法回调YUV数据，硬解下不建议使用抓图功能");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSEHWND), L"是否显示画面，勾选显示，否则不显示");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSEYUV), L"是否回调YUV数据，勾选回调，否则不回调，注意开启硬解后无法回调YUV数据");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSESTREAM), L"是否回调码流数据，勾选回调，否则不回调");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSEMSG), L"是否回调消息，勾选回调，否则不回调");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISASYN), L"是否启用异步模式，启用后将使用异步回放接口回放");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_URL), L"请填入回放URL");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_START), L"发起同步或异步回放（Video_StartPlayback/Video_StartAsynPlayback，取流、取YUV）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_STOP), L"停止回放（Video_StopPlayback，取流、取YUV）");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISBMP), L"使用抓BMP位图，勾选则抓位图，否则抓JPG图片");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SNAP), L"播放抓图（Video_Snap，只有窗口上呈现出画面时才能抓图，也即收到播放开始消息后才能使用）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_SNAL_FILE), L"绝对路径文件名称，不包含后缀");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_OPENSOUND), L"打开声音（Video_SoundCtrl，只有在窗口上呈现出画面时才能打开声音，也即收到播放开始消息后才能使用）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_CLOSESOUND), L"关闭声音（Video_SoundCtrl）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_VIDEO_DETAIL), L"获取视频详情（Video_GetVideoInfo，包括分辨率、码流、帧率、编码类型、封装类型，只有在窗口上呈现出画面时才能打开声音，也即收到播放开始消息后才能使用）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_GETVOLUME), L"获取音量（Video_GetVolume，只有打开声音后才能使用，音量范围为[0 100]）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SETVOLUME), L"设置音量（Video_SetVolume，只有打开声音后才能使用，音量范围为[0 100]，超出范围SDK内部将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_VOLUME), L"音量值，获取的音量在此显示");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_VOLUME_TOSET), L"音量值，范围为[0 100]，超出范围使用边界值");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_X), L"请填入字符叠加起点的横坐标");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_Y), L"请填入字符叠加起点的纵坐标");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_FONTSIZE), L"请填入字符叠加字号大小（默认值0表示字号12）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_R), L"请填入字符叠加字体颜色R分量（取值范围[0 255]，超出将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_G), L"请填入字符叠加字体颜色G分量（取值范围[0 255]，超出将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_B), L"请填入字符叠加字体颜色B分量（取值范围[0 255]，超出将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_ALIGN), L"多行字符串叠加时各行的对齐方式（0-居左对齐 1-居中对齐 2-居右对齐）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_TEXT), L"请填入待叠加字符串，支持换行"); 
	_toolTip.AddTool(GetDlgItem(IDC_COMBO_RECORD_OSD_ID), L"请选择叠加ID（新增叠加选中0，修改或删除选择大于0的值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_BOLD), L"字体是否加粗（1-加粗 0-非加粗 其它值-参数错误）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SETOSD), L"发起字符叠加（Video_SetOSDText，id填0表示新增叠加，新增叠加后返回大于0的叠加id，修改叠加时选择对应的id并修改叠加的字符串等参数，删除叠加时选择对应的id并修改字符串为空字符串即可；最多可新增叠加三次");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_LOCALRECORD_TYPE), L"本地录像类型：0-普通本地录像（不转封装，直接码流存文件，录像文件需要使用专用播放器播放，大华SDK接入设备下载的录像需使用大华播放器播放，海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入设备使用海康播放器播放） 1-转封装，但只要音频或视频不支持则返回失败，错误码为不支持 2-转封装，但如果音频或视频不支持则按不转封装处理 3-转封装，但如果音频不支持视频支持则只转视频，如果都不支持则返回失败，错误码为不支持；一般来说，海康SDK、EHOME/ISUP、ONVIF协议接入设备的视频是支持转封装的，GB28181、大华SDK协议接入设备的视频是不支持转封装的");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_PACKAGESIZE), L"本地录像分包大小（指达到一定大小后重新生成一个文件存码流数据），单位为字节；实际文件的大小不一定和指定的大小相等，可能大一点也可能小一点，这是正常现象；Demo默认500MB");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_LOCAL_FILE), L"本地录像的绝对路径录像文件名称，必须包括mp4后缀");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_START_LOCALRECORD), L"开启本地录像（Video_StartLocalRecord）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_STOP_LOCALRECORD), L"停止本地录像（Video_StopLocalRecord）");	
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_PAUSE), L"暂停（Video_PlayCtrl，支持取流、播放，必须分别收到取流开始、播放开始消息后才能使用");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_RESUME), L"恢复（Video_PlayCtrl，取流、播放暂停后恢复");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_GETTIMESTAMP), L"获取当前播放时间戳（Video_GetCurrentPlayTime，必须出画面后才能使用，也即收到播放开始消息后才能使用");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SEEK), L"定位播放（Video_PlayCtrl，支持定位播放、取流，必须分别收到播放开始、取流开始消息后才能使用）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SPEED), L"倍速播放（Video_PlayCtrl，支持定位播放与取流，必须分别收到播放开始、取流开始后才能使用，支持的倍速值有：-16-16倍速慢放 -8-8倍速慢放 -4-4倍速慢放 -2-2倍速慢放 1-正常速度播放 2-2倍速快放 4-4倍速快放 8-8倍速快放 16-16倍速快放）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_CUR_PLAYTIMESTAMP), L"获取的当前播放时间戳，通过Video_GetCurrentPlayTime获取的时间戳显示在这里");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_TIMESTAP_TOSEEK), L"定位播放或定位取流时间戳参数，Video_PlayCtrl倍速播放或倍速取流时以此参数作为定位参数，支持的倍速值有：-16-16倍速慢放 -8-8倍速慢放 -4-4倍速慢放 -2-2倍速慢放 1-正常速度播放 2-2倍速快放 4-4倍速快放 8-8倍速快放 16-16倍速快放，Video_PlayCtrl倍速播放或倍速取流时使用此参数");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_PARAM), L"倍速播放取值，支持的倍速值有：-16-16倍速慢放 -8-8倍速慢放 -4-4倍速慢放 -2-2倍速慢放 1-正常速度播放 2-2倍速快放 4-4倍速快放 8-8倍速快放 16-16倍速快放");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_STARTDATE), L"播放开始日期");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_STARTTIME), L"播放开始时间");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_ENDDATE), L"播放开始日期");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_ENDTIME), L"播放开始时间");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_PRIVATE_OPEN), L"显示私有数据（Video_PrivateDataCtrl，针对海康设备，这些设备可以以海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入；对于没有子类型的私有数据，各主类型之间可以使用“|”来实现调一次接口控制多个类型，但对于有子类型的，必须对主类型一个一个来控制，其中主类型的各个子类型可以使用“|”实现调一次接口控制同一主类型的多个子类型）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_PRIVATE_CLOSE), L"隐藏私有数据（Video_PrivateDataCtrl，针对海康设备，这些设备可以以海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入；对于没有子类型的私有数据，各主类型之间可以使用“|”来实现调一次接口控制多个类型，但对于有子类型的，必须对主类型一个一个来控制，其中主类型的各个子类型可以使用“|”实现调一次接口控制同一主类型的多个子类型）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_MAINTYPE), L"私有数据主类型，0x0001-智能分析 0x0002-移动侦测 0x0004-POS信息后叠加 0x0008-图片叠加 0x0010-热成像信息 0x0020-温度信息（十进制主类型可选范围为1~63）；对于0x0010（热成像信息），子类型定义为0x0001-点火框显示 0x0002-最高温度 0x0004-最高温度位置 0x0008-最高温度距离（十进制主类型可选范围为1~15）；对于0x0020（温度信息），子类型定义为0x0001-框测温 0x0002-线测温 0x0004-点测温（十进制主类型可选范围为1~7）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_SUBTYPE), L"私有数据子类型，对于0x0010（热成像信息），子类型定义为0x0001-点火框显示 0x0002-最高温度 0x0004-最高温度位置 0x0008-最高温度距离（十进制主类型可选范围为1~15）；对于0x0020（温度信息），子类型定义为0x0001-框测温 0x0002-线测温 0x0004-点测温（十进制主类型可选范围为1~7）");

	_initData();
}

// CRecordPlay 消息处理程序

void CRecordPlayDialog::OnBnClickedButtonRecordStart()
{
	// TODO: 在此添加控件通知处理程序代码
	if (_playHandle > -1)
	{
		_printMsg("当前处于播放、取流或获取YUV状态，请先停止");
		return;
	}

	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_URL, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"回放取流URL不能为空");
		return;
	}
	
	SetDlgItemText(IDC_EDIT_RECORD_STREAM, L"");
	SetDlgItemText(IDC_EDIT_RECORD_YUV, L"");

	CTime ctTemp;
	struct tm tmStart;
	memset(&tmStart, 0, sizeof(tmStart));
	struct tm tmEnd;
	memset(&tmEnd, 0, sizeof(tmEnd));

	_startDate.GetTime(ctTemp);
	tmStart.tm_year = ctTemp.GetYear() - 1900;
	tmStart.tm_mon = ctTemp.GetMonth() - 1;
	tmStart.tm_mday = ctTemp.GetDay();
	_startTime.GetTime(ctTemp);
	tmStart.tm_hour = ctTemp.GetHour();
	tmStart.tm_min = ctTemp.GetMinute();
	tmStart.tm_sec = ctTemp.GetSecond();
	time_t llStartTime = mktime(&tmStart);

	_endDate.GetTime(ctTemp);
	tmEnd.tm_year = ctTemp.GetYear() - 1900;
	tmEnd.tm_mon = ctTemp.GetMonth() - 1;
	tmEnd.tm_mday = ctTemp.GetDay();
	_endTime.GetTime(ctTemp);
	tmEnd.tm_hour = ctTemp.GetHour();
	tmEnd.tm_min = ctTemp.GetMinute();
	tmEnd.tm_sec = ctTemp.GetSecond();
	time_t llEndTime = mktime(&tmEnd);

	bool isUseGpuDecode = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_GPU))->GetCheck();
	bool isAsyn = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISASYN))->GetCheck();
	bool isUseWnd = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEHWND))->GetCheck();
	bool isCbStream = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSESTREAM))->GetCheck();
	bool isCbYUV = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEYUV))->GetCheck();
	bool isCbMsg = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEMSG))->GetCheck();
	HWND hWnd = isUseWnd ? _recordPlayWnd.GetSafeHwnd() : nullptr;

	VIDEO_PLAY_REQ req = { 0 };
	req.pUserData = this;
	req.iHardWareDecode = isUseGpuDecode ? 1 : 0;
	req.fnDecodedStream = isCbYUV ? &CRecordPlayDialog::cb_decodedDataCallback : nullptr;
	req.fnMsg = isCbMsg ? &CRecordPlayDialog::cb_msgCallback : nullptr;
	req.fnStream = isCbStream ? &CRecordPlayDialog::cb_streamCallback : nullptr;	

	USES_CONVERSION;
	std::string url = T2A(str);
	url = StringTrim(url, " ");
	ULONGLONG costs = GetTickCount64();
	_playHandle = isAsyn ? Video_StartAsynPlayback(url.c_str(), hWnd, llStartTime, llEndTime, &req) : Video_StartPlayback(url.c_str(), hWnd, llStartTime, llEndTime, &req);
	costs = GetTickCount64() - costs;
	_printMsg(isAsyn ? "Video_StartAsynPlayback（异步回放）" : "Video_StartPlayback（同步回放）", _playHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordStop()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopPlayback(_playHandle);
	costs = GetTickCount64() - costs;
	_playHandle = -1;
	_printMsg("Video_StopPlayback（停止回放）", ret, Video_GetLastError(), costs);

	// 刷新下窗口
	_recordPlayWnd.ShowWindow(SW_HIDE);
	_recordPlayWnd.ShowWindow(SW_SHOW);

	SetDlgItemText(IDC_EDIT_RECORD_STREAM, L"");
	SetDlgItemText(IDC_EDIT_RECORD_YUV, L"");

	_osdCombBox.ResetContent();
	_osdCombBox.InsertString(0, L"0");
	_osdCombBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdCombBox.SetCurSel(0);
}

void CRecordPlayDialog::OnBnClickedButtonRecordSnap()
{
	// TODO: 在此添加控件通知处理程序代码
	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_SNAL_FILE, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"抓图名称不能为空");
		return;
	}

	bool isBmp = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISBMP))->GetCheck();
	str = str + CString(isBmp ? ".bmp" : ".jpg");

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlaySnap(_playHandle, T2A(str));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlaySnap（回放抓图）", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordOpensound()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl（打开声音）", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordClosesound()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 1);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl（关闭声音）", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordVideoDetail()
{
	// TODO: 在此添加控件通知处理程序代码
	auto systemTypeTransfunc = [](int systemType) {
		std::string str;
		switch (systemType)
		{
		case 4:
			str = "raw";
			break;
		case 1:
			str = "ps";
			break;
		case 3:
			str = "rtp";
			break;
		case 2:
			str = "ts";
			break;
		case 5:
			str = "rtp+ps";
			break;
		default:
			break;
		}

		return str;
	};

	auto encodeTypeTransfunc = [](int encodeType) {
		std::string str;
		switch (encodeType)
		{
		case 6:
			str = "raw";
			break;
		case 1:
			str = "H.264";
			break;
		case 2:
			str = "ps";
			break;
		case 3:
			str = "mp4";
			break;
		case 4:
			str = "H.265";
			break;
		case 5:
			str = "gb";
			break;
		default:
			break;
		}

		return str;
	};

	VIDEO_DETAIL_INFO info = { 0 };
	char buffer[512] = { 0 };
	ULONGLONG costs = GetTickCount64();
	int ret = Video_GetVideoInfo(_playHandle, &info);
	costs = GetTickCount64() - costs;
	if (VIDEO_ERR_SUCCESS == ret)
	{
		sprintf_s(buffer, "获取视频详情：宽度=%d，高度=%d，帧率=%I64d，码率=%f，编码类型=%s，封装类型=%s）", info.iWidth, info.iHeight, info.i64FrameRate, info.fCodeRate, encodeTypeTransfunc(info.iEncodeType).c_str(), systemTypeTransfunc(info.iEncapsulationType).c_str());
	}

	std::string str = std::string("Video_GetVideoInfo（") + (VIDEO_ERR_SUCCESS == ret ? buffer : "获取视频详情）");
	_printMsg(str, ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordGetvolume()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_GetVolume(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_GetVolume（获取音量）", ret != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);

	if (ret != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", ret);
		SetDlgItemText(IDC_EDIT_RECORD_VOLUME, str);
	}
}

void CRecordPlayDialog::OnBnClickedButtonRecordSetvolume()
{
	// TODO: 在此添加控件通知处理程序代码
	CString str;
	GetDlgItemText(IDC_EDIT_PREVIEW_VOLUME_SETVALUE, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"待设置音量值不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SetVolume(_playHandle, atoi(T2A(str)));
	costs = GetTickCount64() - costs;
	_printMsg("Video_SetVolume（设置音量）", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordSetosd()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strR;
	CString strG;
	CString strB;
	CString strIsBold;
	CString strFontSize;
	CString strX;
	CString strY;
	CString strAlignType;
	GetDlgItemText(IDC_EDIT_RECORD_OSD_R, strR);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_G, strG);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_B, strB);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_BOLD, strIsBold);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_FONTSIZE, strFontSize);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_X, strX);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_Y, strY);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_ALIGN, strAlignType);
	if (strR.IsEmpty() || strG.IsEmpty() || strB.IsEmpty() || strIsBold.IsEmpty() || strFontSize.IsEmpty() || strX.IsEmpty() || strY.IsEmpty() || strAlignType.IsEmpty())
	{
		AfxMessageBox(L"字符叠加参数不能为空");
		return;
	}

	CString strText;
	GetDlgItemText(IDC_EDIT_RECORD_OSD_TEXT, strText);

	int index = _osdCombBox.GetCurSel();
	int osdId = (int)_osdCombBox.GetItemData(index);
	VIDEO_OSD_INFO info = { 0 };
	USES_CONVERSION;
	info.ix = atoi(T2A(strX));
	info.iy = atoi(T2A(strY));
	info.iAlignType = atoi(T2A(strAlignType));
	int r = atoi(T2A(strR));
	int g = atoi(T2A(strG));
	int b = atoi(T2A(strB));
	info.i64Color = RGB(r > 255 ? 255 : (r < 0 ? 0 : r), g > 255 ? 255 : (g < 0 ? 0 : g), b > 255 ? 255 : (b < 0 ? 0 : b));
	info.iFontSize = atoi(T2A(strFontSize));
	info.iBold = atoi(T2A(strIsBold));

	ULONGLONG costs = GetTickCount64();
	int ret = Video_SetOSDText(_playHandle, osdId, T2A(strText), &info);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SetOSDText（字符叠加）", ret > 0 ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);

	if (ret > 0)
	{
		// 首次叠加
		if (osdId < 1)
		{
			CString str;
			str.Format(L"%d", ret);
			_osdCombBox.InsertString(ret, str);  // iId 从1开始
			_osdCombBox.SetItemData(ret, static_cast<DWORD_PTR>(ret));
			_osdCombBox.SetCurSel(ret);
			return;
		}

		// 删除叠加
		if (strText.IsEmpty())
		{
			_osdCombBox.DeleteString(index);
			_osdCombBox.SetCurSel(0);
		}
	}
}

void CRecordPlayDialog::OnBnClickedButtonRecordStartLocalrecord()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strFile;
	GetDlgItemText(IDC_EDIT_RECORD_LOCAL_FILE, strFile);
	if (strFile.IsEmpty())
	{
		AfxMessageBox(L"本地录像文件名称不能为空");
		return;
	}

	CString strType;
	GetDlgItemText(IDC_EDIT_RECORD_LOCALRECORD_TYPE, strType);
	if (strType.IsEmpty())
	{
		AfxMessageBox(L"本地录像类型不能为空");
		return;
	}

	CString strPackageSize;
	GetDlgItemText(IDC_EDIT_RECORD_PACKAGESIZE, strPackageSize);
	if (strPackageSize.IsEmpty())
	{
		AfxMessageBox(L"本地录像分包大小不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAPackageSize = T2A(strPackageSize);
	std::string szAType = T2A(strType);
	int ret = Video_StartLocalRecord(_playHandle, T2A(strFile), atoi(szAPackageSize.c_str()), atoi(szAType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_StartLocalRecord（开始本地录像）", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordStopLocalrecord()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopLocalRecord(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_StopLocalRecord（停止本地录像）", ret > VIDEO_ERR_SUCCESS ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordPause()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 0, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl（暂停播放或暂停取流）", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordResume()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 1, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl（恢复播放或恢复取流）", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordGettimestamp()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	VIDEO_INT64 ret = Video_GetCurrentPlayTime(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_GetCurrentPlayTime（获取当前播放时间戳）", ret > 0 ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
	if (ret > 0)
	{
		CString str;
		str.Format(L"%lld", ret);
		SetDlgItemText(IDC_EDIT_RECORD_CUR_PLAYTIMESTAMP, str);
	}
}

void CRecordPlayDialog::OnBnClickedButtonRecordSeek()
{	
	// TODO: 在此添加控件通知处理程序代码
	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_TIMESTAP_TOSEEK, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"定位时间戳不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 2, atoll(T2A(str)));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl（定位播放或定位取流）", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordSpeed()
{
	// TODO: 在此添加控件通知处理程序代码
	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_PARAM, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"倍速播放速度值不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 3, atoi(T2A(str)));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl（倍速播放或倍速取流）", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordPrivateOpen()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strMainType;
	GetDlgItemText(IDC_EDIT_RECORD_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"私有数据主类型不能为空");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_RECORD_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"私有数据子类型不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_playHandle, atoi(szAMainType.c_str()), 0, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl（私有数据显示）", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordPrivateClose()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strMainType;
	GetDlgItemText(IDC_EDIT_RECORD_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"私有数据主类型不能为空");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_RECORD_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"私有数据子类型不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_playHandle, atoi(szAMainType.c_str()), 1, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl（私有数据隐藏）", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::_initData()
{
	// 需要禁用一些控件
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEHWND))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSESTREAM))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEYUV))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEMSG))->SetCheck(BST_CHECKED);

	USES_CONVERSION;
	_snapPicFile = A2T(std::string(_exefold + "/playback_picture").c_str());
	_localRecordFile = A2T(std::string(_exefold + "/playback_localRecord.mp4").c_str());
	SetDlgItemText(IDC_EDIT_RECORD_SNAL_FILE, _snapPicFile);
	SetDlgItemText(IDC_EDIT_RECORD_LOCAL_FILE, _localRecordFile);

	_osdCombBox.InsertString(0, L"0");  // iId 从1开始
	_osdCombBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdCombBox.SetCurSel(0);

	SYSTEMTIME stTime;
	GetLocalTime(&stTime);
	stTime.wHour = 0;
	stTime.wSecond = 0;
	stTime.wMinute = 0;
	stTime.wMilliseconds = 0;
	_startDate.SetTime(&stTime);
	_startTime.SetTime(&stTime);
	_endDate.SetTime(&stTime);

	stTime.wHour = 23;
	stTime.wSecond = 59;
	stTime.wMinute = 59;
	stTime.wMilliseconds = 0;
	_endTime.SetTime(&stTime);	
}

void CRecordPlayDialog::_printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs)
{
	char buffer[512] = { 0 };
	sprintf_s(buffer, "%s执行%s，耗时%I64d毫秒，错误码为%d", func.c_str(), ret != VIDEO_ERR_SUCCESS ? "失败" : "成功", costs, errorCode);

	if (_msgBox.GetCount() > 100)
	{
		_msgBox.ResetContent();
	}

	USES_CONVERSION;
	_msgBox.InsertString(0, A2T(buffer));
    _showListHovScollBar();
}

void CRecordPlayDialog::_printMsg(const std::string& msg)
{
	if (_msgBox.GetCount() > 100)
	{
		_msgBox.ResetContent();
	}

	USES_CONVERSION;
	_msgBox.InsertString(0, A2T(msg.c_str()));
    _showListHovScollBar();
}

void CRecordPlayDialog::_showListHovScollBar()
{
    CDC *pDC = _msgBox.GetDC();
    if (NULL == pDC)
    {
        return;
    }

    int nCount = _msgBox.GetCount();
    if (nCount < 1)
    {
        _msgBox.SetHorizontalExtent(0);
        return;
    }

    int nMaxExtent = 0;
    CString szText;
    for (int i = 0; i < nCount; ++i)
    {
        _msgBox.GetText(i, szText);
        CSize &cs = pDC->GetTextExtent(szText);
        if (cs.cx > nMaxExtent)
        {
            nMaxExtent = cs.cx;
        }
    }

    _msgBox.SetHorizontalExtent(nMaxExtent);
}

void CRecordPlayDialog::cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void * pUserData)
{
	CRecordPlayDialog* pThis = reinterpret_cast<CRecordPlayDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	auto msgTransFunc = [](int msgType) {
		std::string str;
		switch (msgType)
		{
		case 1:
			str = "播放开始";
			break;
		case 2:
			str = "播放结束";
			break;
		case 3:
			str = "播放异常";
			break;
		case 10:
			str = "取流开始";
			break;
		case 11:
			str = "取流结束";
			break;
		case 12:
			str = "取流异常";
			break;
		case 13:
			str = "倒放取流不支持";
			break;
		case 50:
			str = "异步发起取流成功";
			break;
		case 51:
			str = "异步发起取流失败";
			break;
		default:
			str = "未知";
			break;
		}

		return str;
	};

	std::string* str = new (std::nothrow) std::string();
	if (str != nullptr)
	{
		*str = "消息类型：" + msgTransFunc(iMsg);
		pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_MSG, reinterpret_cast<LPARAM>(str));
	}
}

void __stdcall CRecordPlayDialog::cb_streamCallback(VIDEO_INT64 i64PlayHandle, int iStreamDataType, const char* pDataArray, int iDataLen, void* pUserData)
{
	CRecordPlayDialog* pThis = reinterpret_cast<CRecordPlayDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	time_t tmp = time(nullptr);
	if (abs(tmp - pThis->_time4Stream) > 1)
	{
		pThis->_time4Stream = tmp;

		char buffer[1024] = { 0 };
		sprintf_s(buffer, "流类型：%s，流长度：%d", 0 == iStreamDataType ? "流头" : (1 == iStreamDataType ? "流数据" : 2 == iStreamDataType ? "结束标记" : "未知"), iDataLen);
		std::string* str = new (std::nothrow) std::string();
		if (str != nullptr)
		{
			*str = buffer;
			pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_STREAM, reinterpret_cast<LPARAM>(str));
		}
	}
}

void CRecordPlayDialog::cb_decodedDataCallback(VIDEO_INT64 i64PlayHandle, const char * pDataArray, int iDataLen, int iWidth, int iHeight, int iFrameType, int iTimeStamp, void * pUserData)
{
	CRecordPlayDialog* pThis = reinterpret_cast<CRecordPlayDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	time_t tmp = time(nullptr);
	if (abs(tmp - pThis->_time4Yuv) > 1)
	{
		pThis->_time4Yuv = tmp;

		char buffer[1024] = { 0 };
		sprintf_s(buffer, "YUV类型：YV12，流长度：%d，宽度：%d，高度：%d", iDataLen, iWidth, iHeight);
		std::string* str = new (std::nothrow) std::string();
		if (str != nullptr)
		{
			*str = buffer;
			pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_YUV, reinterpret_cast<LPARAM>(str));
		}
	}
}

LRESULT CRecordPlayDialog::OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam)
{
	std::string* str = reinterpret_cast<std::string*>(lparam);
	if (str != nullptr)
	{
		switch (wparam)
		{
		case CALLBACK_MSG:
		{
			USES_CONVERSION;
			_printMsg(*str);
			SetDlgItemText(IDC_EDIT_RECORD_MSG, A2T((*str).c_str()));
		}
			break;
		case CALLBACK_STREAM:
		{
			USES_CONVERSION;
			_streamInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_RECORD_STREAM, _streamInfo);
		}
			break;
		case CALLBACK_YUV:
		{
			USES_CONVERSION;
			_yuvInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_RECORD_YUV, _yuvInfo);
		}
			break;
		default:
			break;
		}

		delete str;
	}

	return 0;
}

void CRecordPlayDialog::OnLbnDblclkListPlaybackMsgbox()
{
	int index = _msgBox.GetCurSel();
	if (index < 0)
	{
		return;
	}

	CString str;
	_msgBox.GetText(index, str);
	AfxMessageBox(str, MB_OK | MB_ICONINFORMATION);
}
