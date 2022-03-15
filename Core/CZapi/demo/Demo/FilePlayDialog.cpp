// FilePlay.cpp : 实现文件
//

#include "stdafx.h"
#include "Demo.h"
#include "FilePlayDialog.h"
#include "afxdialogex.h"

#define MSG_UPDATE (WM_USER + 1500)
// CFilePlay 对话框

IMPLEMENT_DYNAMIC(CFilePlayDialog, CDialog)

CFilePlayDialog::CFilePlayDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_FILEPLAY, pParent)
    , _filePlayName(_T(""))
    , _filePlayVoice(0)
    , _snapFileName(_T(""))
	, _volumeToSet(0)
	, _speed(0)
	, _secondsToSeek(0)
	, _privateMainType(0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020)
	, _privateSubType(0)
{
    
}

CFilePlayDialog::~CFilePlayDialog()
{
}

void CFilePlayDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT_PLAYFILENAME, _filePlayName);
	DDX_Control(pDX, IDC_STATIC_FILEPLAYWND, _playWnd);
	DDX_Control(pDX, IDC_LIST_FILEPLAY_MSG, _msgList);
	DDX_Text(pDX, IDC_EDIT_FILEPLAYVOLUME, _filePlayVoice);
	DDX_Text(pDX, IDC_EDIT_FILESNAPNAME, _snapFileName);
	DDX_Text(pDX, IDC_EDIT_FILEPLAYVOLUME_TOSET, _volumeToSet);
	DDX_Control(pDX, IDC_CHECK_FILEPLAY_ISBMP, _useBmpCtrl);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_SPEED, _speed);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_SEEKTIME, _secondsToSeek);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_MAINTYPE, _privateMainType);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_SUBTYPE, _privateSubType);
}

BEGIN_MESSAGE_MAP(CFilePlayDialog, CDialog)
    ON_BN_CLICKED(IDC_BUTTON_STARTFILEPLAY, &CFilePlayDialog::OnBnClickedButtonStartfileplay)
    ON_BN_CLICKED(IDC_BUTTON_STOPFILEPLAY, &CFilePlayDialog::OnBnClickedButtonStopfileplay)
    ON_BN_CLICKED(IDC_BUTTON_GETFILEDURATION, &CFilePlayDialog::OnBnClickedButtonGetfileduration)
    ON_BN_CLICKED(IDC_BUTTON_GETFILEPLAYEDTIME, &CFilePlayDialog::OnBnClickedButtonGetfileplayedtime)
    ON_BN_CLICKED(IDC_BUTTON_OPENFILEVOICE, &CFilePlayDialog::OnBnClickedButtonOpenfilevoice)
    ON_BN_CLICKED(IDC_BUTTON_CLOSEFILEVOICE, &CFilePlayDialog::OnBnClickedButtonClosefilevoice)
    ON_BN_CLICKED(IDC_BUTTON_SETVOLUME, &CFilePlayDialog::OnBnClickedButtonSetvolume)
    ON_BN_CLICKED(IDC_BUTTON_GETVOLUME, &CFilePlayDialog::OnBnClickedButtonGetvolume)
    ON_BN_CLICKED(IDC_BUTTON_FILEPLAYSNAP, &CFilePlayDialog::OnBnClickedButtonFileplaysnap)
	ON_LBN_DBLCLK(IDC_LIST_FILEPLAY_MSG, &CFilePlayDialog::OnLbnDblclkListPlaybackMsgbox)
    ON_MESSAGE(MSG_UPDATE, &CFilePlayDialog::_onUpdateMsg)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_PAUSE, &CFilePlayDialog::OnBnClickedButtonFileplayPause)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_RESUME, &CFilePlayDialog::OnBnClickedButtonFileplayResume)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_SPEEDPLAY, &CFilePlayDialog::OnBnClickedButtonFileplaySpeedplay)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_SEEKPLAY, &CFilePlayDialog::OnBnClickedButtonFileplaySeekplay)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_PRIVATE_OPEN, &CFilePlayDialog::OnBnClickedButtonFileplayPrivateOpen)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_PRIVATE_CLOSE, &CFilePlayDialog::OnBnClickedButtonFileplayPrivateClose)
END_MESSAGE_MAP()

void CFilePlayDialog::NotifyDialogInited(const char* exeFolder)
{
	_exefold = nullptr == exeFolder ? "" : exeFolder;
    EnableToolTips(TRUE);
    _toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
    _toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_STARTFILEPLAY), L"开始播放（Video_StartFilePlay）");
    _toolTip.AddTool(GetDlgItem(IDC_EDIT_PLAYFILENAME), L"视频文件绝对路径文件名称，包含后缀，如“D:\\test.mp4”");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_STOPFILEPLAY), L"停止播放（Video_StopFilePlay）");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_GETFILEDURATION), L"获取文件总时长（Video_GetFilePlayDuration，单位秒）");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_GETFILEPLAYEDTIME), L"获取文件已播放时长（Video_GetFilePlayedTime，单位秒）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_SEEKPLAY), L"定位播放（Video_PlayCtrl）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_FILEDURATION), L"文件总时长，单位秒");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_SEEKTIME), L"文件定位播放时间，单位秒；从0开始，填充文件总时长内的秒数");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_PLAYEDTIME), L"文件已播放时长，单位秒");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_PAUSE), L"暂停播放（Video_PlayCtrl）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_RESUME), L"恢复播放（Video_PlayCtrl）");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_SPEEDPLAY), L"倍速播放（Video_PlayCtrl，必须收到播放开始消息才能使用，支持的倍速值有：-16-16倍速慢放 -8-8倍速慢放 -4-4倍速慢放 -2-2倍速慢放 1-正常速度播放 2-2倍速快放 4-4倍速快放 8-8倍速快放 16-16倍速快放）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_SPEED), L"倍速播放取值，支持的倍速值有：-16-16倍速慢放 -8-8倍速慢放 -4-4倍速慢放 -2-2倍速慢放 1-正常速度播放 2-2倍速快放 4-4倍速快放 8-8倍速快放 16-16倍速快放");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_OPENFILEVOICE), L"打开声音（Video_SoundCtrl，只有在窗口上呈现出画面时才能打开声音，也即收到播放开始消息后才能使用）");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_CLOSEFILEVOICE), L"关闭声音（Video_SoundCtrl）");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_SETVOLUME), L"设置音量（Video_SetVolume，打开声音后使用，音量范围[0 100]，超出范围使用边界值）");
    _toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAYVOLUME), L"音量值，获取的音量在此显示"); 
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAYVOLUME_TOSET), L"音量值，范围为[0 100]，超出范围使用边界值");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_FILEPLAY_ISBMP), L"使用抓BMP位图，勾选则抓位图，否则抓JPG图片");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILESNAPNAME), L"绝对路径文件名称，不包含后缀");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_GETVOLUME), L"获取音量（Video_GetVolume，只有打开声音后才能使用，音量范围[0 100]）");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAYSNAP), L"播放抓图（Video_PlaySnap，默认抓jpg图，如果启用“是否启用BMP抓图”则抓BMP位图）"); 
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_PRIVATE_OPEN), L"显示私有数据（Video_PrivateDataCtrl，针对海康设备，这些设备可以以海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入；对于没有子类型的私有数据，各主类型之间可以使用“|”来实现调一次接口控制多个类型，但对于有子类型的，必须对主类型一个一个来控制（否则将忽略子类型），其中主类型的各个子类型可以使用“|”实现调一次接口控制同一主类型的多个子类型）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_PRIVATE_CLOSE), L"隐藏私有数据（Video_PrivateDataCtrl，针对海康设备，这些设备可以以海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入；对于没有子类型的私有数据，各主类型之间可以使用“|”来实现调一次接口控制多个类型，但对于有子类型的，必须对主类型一个一个来控制，其中主类型的各个子类型可以使用“|”实现调一次接口控制同一主类型的多个子类型）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_MAINTYPE), L"私有数据主类型，0x0001-智能分析 0x0002-移动侦测 0x0004-POS信息后叠加 0x0008-图片叠加 0x0010-热成像信息 0x0020-温度信息（十进制主类型可选范围为1~63）；对于0x0010（热成像信息），子类型定义为0x0001-点火框显示 0x0002-最高温度 0x0004-最高温度位置 0x0008-最高温度距离（十进制主类型可选范围为1~15）；对于0x0020（温度信息），子类型定义为0x0001-框测温 0x0002-线测温 0x0004-点测温（十进制主类型可选范围为1~7）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_SUBTYPE), L"私有数据子类型，对于0x0010（热成像信息），子类型定义为0x0001-点火框显示 0x0002-最高温度 0x0004-最高温度位置 0x0008-最高温度距离（十进制主类型可选范围为1~15）；对于0x0020（温度信息），子类型定义为0x0001-框测温 0x0002-线测温 0x0004-点测温（十进制主类型可选范围为1~7）");

	USES_CONVERSION;
	_snapFileName = A2T(std::string(_exefold + "/filePlay_picture").c_str());
	SetDlgItemText(IDC_EDIT_FILESNAPNAME, _snapFileName);
	SetDlgItemText(IDC_EDIT_FILEPLAY_FILEDURATION, L"0");
	SetDlgItemText(IDC_EDIT_FILEPLAY_PLAYEDTIME, L"0");
}

BOOL CFilePlayDialog::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}

// 开始播放
void CFilePlayDialog::OnBnClickedButtonStartfileplay()
{
    if (_filePlayHandle != -1)
    {
        _printMsg("当前正在播放，请先停止播放");
        return;
    }

	CString str;
	GetDlgItemText(IDC_EDIT_PLAYFILENAME, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"绝对路径文件名称不能为空");
		return;
	}

    HWND hWnd = _playWnd.GetSafeHwnd();
    stFilePlayReq filePlayReq;
    filePlayReq = { 0 };
    filePlayReq.fnMsg = &CFilePlayDialog::cb_msgCallback;
    filePlayReq.pUserData = this;

    USES_CONVERSION;
	std::string fileName = T2A(str);
    ULONGLONG costTime = GetTickCount64();
    _filePlayHandle = Video_StartFilePlay(fileName.c_str(), hWnd, &filePlayReq);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_StartFilePlay（开始文件播放）", _filePlayHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
}

// 停止播放
void CFilePlayDialog::OnBnClickedButtonStopfileplay()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_StopFilePlay(_filePlayHandle);
    _filePlayHandle = -1;
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_StopFilePlay（停止文件播放）", ret, Video_GetLastError(), costTime);
    //更新窗口，删掉最后一帧
    PostMessage(MSG_UPDATE);

	// 刷新下窗口
	_playWnd.ShowWindow(SW_HIDE);
	_playWnd.ShowWindow(SW_SHOW);
}

// 获取文件总时长
void CFilePlayDialog::OnBnClickedButtonGetfileduration()
{
    ULONGLONG costTime = GetTickCount64();
    VIDEO_INT64 retDuration = Video_GetFilePlayDuration(_filePlayHandle);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_GetFilePlayDuration（获取文件总时长）", retDuration != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
	if (retDuration != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", retDuration);
		SetDlgItemText(IDC_EDIT_FILEPLAY_FILEDURATION, str);
	}
}

// 获取当前已播放秒数
void CFilePlayDialog::OnBnClickedButtonGetfileplayedtime()
{
    ULONGLONG costTime = GetTickCount64();
    VIDEO_INT64 retPlayedTime = Video_GetFilePlayedTime(_filePlayHandle);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_GetFilePlayedTime（获取已播放时长）", retPlayedTime != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
	if (retPlayedTime != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", retPlayedTime);
		SetDlgItemText(IDC_EDIT_FILEPLAY_PLAYEDTIME, str);
	}
}

// 打开声音
void CFilePlayDialog::OnBnClickedButtonOpenfilevoice()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_SoundCtrl(_filePlayHandle, 0);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_SoundCtrl（打开声音）", ret, Video_GetLastError(), costTime);
}

// 关闭声音
void CFilePlayDialog::OnBnClickedButtonClosefilevoice()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_SoundCtrl(_filePlayHandle, 1);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_SoundCtrl（关闭声音）", ret, Video_GetLastError(), costTime);
}

// 设置音量
void CFilePlayDialog::OnBnClickedButtonSetvolume()
{
	CString str;
	GetDlgItemText(IDC_EDIT_FILEPLAYVOLUME_TOSET, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"待设置音量值不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_SetVolume(_filePlayHandle, atoi(T2A(str)));
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_SetVolume（设置音量）", ret, Video_GetLastError(), costTime);
}

// 获取音量
void CFilePlayDialog::OnBnClickedButtonGetvolume()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_GetVolume(_filePlayHandle);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_GetVolume（获取音量）", ret != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
	if (ret != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", ret);
		SetDlgItemText(IDC_EDIT_FILEPLAYVOLUME, str);
	}
}

// 播放抓图
void CFilePlayDialog::OnBnClickedButtonFileplaysnap()
{
	CString str;
	GetDlgItemText(IDC_EDIT_FILESNAPNAME, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"抓图名称不能为空");
		return;
	}

	bool isBmp = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_FILEPLAY_ISBMP))->GetCheck();
	str = str + CString(isBmp ? ".bmp" : ".jpg");

    USES_CONVERSION;
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_PlaySnap(_filePlayHandle, T2A(str));
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_PlaySnap（文件播放抓图）", ret, Video_GetLastError(), costTime);
}

void CFilePlayDialog::_printMsg(const std::string& msg)
{
    if (_msgList.GetCount() > 100)
    {
        //后续考虑删除最后一行，而不是全部删除
        _msgList.ResetContent();
    }

    USES_CONVERSION;
    _msgList.InsertString(0, A2T(msg.c_str()));

    _showListHovScollBar();
}

void CFilePlayDialog::_printMsg(const std::string& func, int ret, int errcodeCode, ULONGLONG costs)
{
    char buffer[512] = { 0 };
    sprintf_s(buffer, "%s执行%s, 耗时%I64d毫秒，错误码为%d", func.c_str(), ret != VIDEO_ERR_SUCCESS ? "失败" : "成功", costs, errcodeCode);
    if (_msgList.GetCount() > 100)
    {
        _msgList.ResetContent();
    }

    USES_CONVERSION;
    _msgList.InsertString(0, A2T(buffer));

    _showListHovScollBar();
}

void CFilePlayDialog::_showListHovScollBar()
{
    CDC *pDC = _msgList.GetDC();
    if (NULL == pDC)
    {
        return;
    }

    int nCount = _msgList.GetCount();
    if (nCount < 1)
    {
        _msgList.SetHorizontalExtent(0);
        return;
    }

    int nMaxExtent = 0;
    CString szText;
    for (int i = 0; i < nCount; ++i)
    {
        _msgList.GetText(i, szText);
        CSize &cs = pDC->GetTextExtent(szText);
        if (cs.cx > nMaxExtent)
        {
            nMaxExtent = cs.cx;
        }
    }

    _msgList.SetHorizontalExtent(nMaxExtent);
}

void __stdcall CFilePlayDialog::cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void* pUserData)
{
    CFilePlayDialog* pThis = static_cast<CFilePlayDialog*>(pUserData);
    if (pThis != NULL)
    {
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
			default:
				str = "未知";
				break;
			}

			return str;
		};

        pThis->_printMsg(msgTransFunc(iMsg));
    }
}

LRESULT CFilePlayDialog::_onUpdateMsg(WPARAM wparam, LPARAM lparam)
{
    return 0;
}

void CFilePlayDialog::OnLbnDblclkListPlaybackMsgbox()
{
	int index = _msgList.GetCurSel();
	if (index < 0)
	{
		return;
	}

	CString str;
	_msgList.GetText(index, str);
	AfxMessageBox(str, MB_OK | MB_ICONINFORMATION);
}

// 暂停播放
void CFilePlayDialog::OnBnClickedButtonFileplayPause()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 0, 0);
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl（暂停播放）", ret, Video_GetLastError(), costTime);
}

// 恢复播放
void CFilePlayDialog::OnBnClickedButtonFileplayResume()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 1, 0);
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl（恢复播放）", ret, Video_GetLastError(), costTime);
}

// 倍速播放
void CFilePlayDialog::OnBnClickedButtonFileplaySpeedplay()
{
	// TODO: 在此添加控件通知处理程序代码
	CString str;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SPEED, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"倍速播放速度值不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 3, atoi(T2A(str)));
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl（倍速播放）", ret, Video_GetLastError(), costTime);
}

// 定位播放
void CFilePlayDialog::OnBnClickedButtonFileplaySeekplay()
{
	// TODO: 在此添加控件通知处理程序代码
	CString str;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SEEKTIME, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"定位时间不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 2, atoll(T2A(str)));
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl（定位播放）", ret, Video_GetLastError(), costTime);
}


void CFilePlayDialog::OnBnClickedButtonFileplayPrivateOpen()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strMainType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"私有数据主类型不能为空");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"私有数据子类型不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_filePlayHandle, atoi(szAMainType.c_str()), 0, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl（私有数据显示）", ret, Video_GetLastError(), costs);
}


void CFilePlayDialog::OnBnClickedButtonFileplayPrivateClose()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strMainType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"私有数据主类型不能为空");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"私有数据子类型不能为空");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_filePlayHandle, atoi(szAMainType.c_str()), 1, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl（私有数据隐藏）", ret, Video_GetLastError(), costs);
}
