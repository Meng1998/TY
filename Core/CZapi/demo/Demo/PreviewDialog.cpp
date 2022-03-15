// PreviewDialogEx.cpp : 实现文件
//

#include "stdafx.h"
#include "Demo.h"
#include "PreviewDialog.h"
#include "afxdialogex.h"


// CPreviewDialogEx 对话框

IMPLEMENT_DYNAMIC(CPreviewDialog, CDialog)

CPreviewDialog::CPreviewDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_PREVIEW, pParent)
	, _url(_T(""))
	, _snapPicAbsoluteFileName(_T(""))
	, _volume(0)
	, _osdText(_T(""))
	, _localRecordAbsoluteFileName(_T(""))
	, _localRecordType(0)
	, _osdStartX(0)
	, _osdStartY(0)
	, _osdFontSize(0)
	, _osdColorR(0)
	, _osdColorG(0)
	, _osdColorB(0)
	, _osdAlignType(0)
	, _osdBold(0)
	, _streamInfo(_T(""))
	, _yuvInfo(_T(""))
	, _volumeToSet(0)
	, _packageSize(1024 * 1024 * 500)
	, _privateMainType(0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020)
	, _privateSubType(0)
{

}

CPreviewDialog::~CPreviewDialog()
{
}

void CPreviewDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_STATIC_PREVIEW, _playWnd);
	DDX_Control(pDX, IDC_LIST_PREVIEW, _msgList);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_URL, _url);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_SNAL_FILE, _snapPicAbsoluteFileName);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_VOLUME, _volume);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_TEXT, _osdText);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_LOCAL_FILE, _localRecordAbsoluteFileName);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_LOCALRECORD_TYPE, _localRecordType);
	DDX_Control(pDX, IDC_COMBO_PREVIEW_OSD_ID, _osdIdComboBox);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_X, _osdStartX);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_Y, _osdStartY);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_FONTSIZE, _osdFontSize);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_R, _osdColorR);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_G, _osdColorG);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_B, _osdColorB);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_ALIGN, _osdAlignType);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_BOLD, _osdBold);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_STREAM, _streamInfo);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_YUV, _yuvInfo);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_VOLUME_SETVALUE, _volumeToSet);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_PACKAGESIZE, _packageSize);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_MAINTYPE, _privateMainType);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_SUBTYPE, _privateSubType);
}

BEGIN_MESSAGE_MAP(CPreviewDialog, CDialog)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_PLAY, &CPreviewDialog::OnBnClickedButtonPreviewPlay)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_STOP, &CPreviewDialog::OnBnClickedButtonPreviewStop)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_SNAP, &CPreviewDialog::OnBnClickedButtonPreviewSnap)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_OPENSOUND, &CPreviewDialog::OnBnClickedButtonPreviewOpensound)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_CLOSESOUND, &CPreviewDialog::OnBnClickedButtonPreviewClosesound)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_VIDEO_DETAIL, &CPreviewDialog::OnBnClickedButtonPreviewVideoDetail)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_GETVOLUME, &CPreviewDialog::OnBnClickedButtonPreviewGetvolume)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_SETVOLUME, &CPreviewDialog::OnBnClickedButtonPreviewSetvolume)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_SETOSD, &CPreviewDialog::OnBnClickedButtonPreviewSetosd)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_START_LOCALRECORD, &CPreviewDialog::OnBnClickedButtonPreviewStartLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_STOP_LOCALRECORD, &CPreviewDialog::OnBnClickedButtonPreviewStopLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_CHANGLE_STREAMTYPE, &CPreviewDialog::OnBnClickedButtonPreviewChangleStreamtype)
	ON_LBN_DBLCLK(IDC_LIST_PREVIEW, &CPreviewDialog::OnLbnDblclkListPlaybackMsgbox)
	ON_MESSAGE(MSG_UPDATE_CALLBACKINFO, &CPreviewDialog::OnUpdateCallbackInfo)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_PRIVATE_OPEN, &CPreviewDialog::OnBnClickedButtonPreviewPrivateOpen)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_PRIVATE_CLOSE, &CPreviewDialog::OnBnClickedButtonPreviewPrivateClose)
END_MESSAGE_MAP()


// CPreviewDialogEx 消息处理程序


void CPreviewDialog::OnBnClickedButtonPreviewPlay()
{
	// TODO: 在此添加控件通知处理程序代码
	if (_playHandle > -1)
	{
		_printMsg("当前处于播放、取流或获取YUV状态，请先停止");
		return;
	}
	
	CString str;
	GetDlgItemText(IDC_EDIT_PREVIEW_URL, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"预览取流URL不能为空");
		return;
	}

	SetDlgItemText(IDC_EDIT_PREVIEW_STREAM, L"");
	SetDlgItemText(IDC_EDIT_PREVIEW_YUV, L"");

	UpdateData(TRUE);

	bool isUseGpuDecode = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_GPU))->GetCheck();
	bool isAsyn = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISASYN))->GetCheck();
	bool isUseWnd = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEHWND))->GetCheck();
	bool isCbStream = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSESTREAM))->GetCheck();
	bool isCbYUV = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEYUV))->GetCheck();
	bool isCbMsg = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_ISUSEMSG))->GetCheck();
	HWND hWnd = isUseWnd ? _playWnd.GetSafeHwnd() : nullptr;

	VIDEO_PLAY_REQ req = { 0 };
	req.pUserData = this;
	req.iHardWareDecode = isUseGpuDecode ? 1 : 0;
	req.fnDecodedStream = isCbYUV ? &CPreviewDialog::cb_decodedDataCallback : nullptr;
	req.fnMsg = isCbMsg ? &CPreviewDialog::cb_msgCallback : nullptr;
	req.fnStream = isCbStream ? &CPreviewDialog::cb_streamCallback : nullptr;

	USES_CONVERSION;
	std::string url = T2A(str);
	url = StringTrim(url, " ");
	ULONGLONG costs = GetTickCount64();
	_playHandle = isAsyn ? Video_StartAsynPreview(url.c_str(), hWnd, &req) : Video_StartPreview(url.c_str(), hWnd, &req);
	costs = GetTickCount64() - costs;
	_printMsg(isAsyn ? "Video_StartAsynPreview（异步预览）" : "Video_StartPreview（同步预览）", _playHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewStop()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopPreview(_playHandle);
	costs = GetTickCount64() - costs;
	_playHandle = -1;
	_printMsg("Video_StopPreview（停止预览）",ret, Video_GetLastError(), costs);

	// 刷新下窗口
	_playWnd.ShowWindow(SW_HIDE);
	_playWnd.ShowWindow(SW_SHOW);

	SetDlgItemText(IDC_EDIT_PREVIEW_STREAM, L"");
	SetDlgItemText(IDC_EDIT_PREVIEW_YUV, L"");

	_osdIdComboBox.ResetContent();
	_osdIdComboBox.InsertString(0, L"0");
	_osdIdComboBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdIdComboBox.SetCurSel(0);
}


void CPreviewDialog::OnBnClickedButtonPreviewSnap()
{
	// TODO: 在此添加控件通知处理程序代码
	CString str;
	GetDlgItemText(IDC_EDIT_PREVIEW_SNAL_FILE, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"抓图名称不能为空");
		return;
	}

	bool isBmp = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISBMP))->GetCheck();
	str = str + CString(isBmp ? ".bmp" : ".jpg");

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlaySnap(_playHandle, T2A(str));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlaySnap（预览抓图）", ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewOpensound()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl（打开声音）", ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewClosesound()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 1);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl（关闭声音）", ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewVideoDetail()
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


void CPreviewDialog::OnBnClickedButtonPreviewGetvolume()
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
		SetDlgItemText(IDC_EDIT_PREVIEW_VOLUME, str);
	}
}

void CPreviewDialog::OnBnClickedButtonPreviewSetvolume()
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


void CPreviewDialog::OnBnClickedButtonPreviewSetosd()
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
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_R, strR);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_G, strG);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_B, strB);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_BOLD, strIsBold);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_FONTSIZE, strFontSize);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_X, strX);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_Y, strY); 
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_ALIGN, strAlignType);
	if (strR.IsEmpty() || strG.IsEmpty() || strB.IsEmpty() || strIsBold.IsEmpty() || strFontSize.IsEmpty() || strX.IsEmpty() || strY.IsEmpty() || strAlignType.IsEmpty())
	{
		AfxMessageBox(L"字符叠加参数不能为空");
		return;
	}

	CString strText;
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_TEXT, strText);

	int index = _osdIdComboBox.GetCurSel();
	int osdId = (int)_osdIdComboBox.GetItemData(index);
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
			_osdIdComboBox.InsertString(ret, str);  // iId 从1开始
			_osdIdComboBox.SetItemData(ret, static_cast<DWORD_PTR>(ret));
			_osdIdComboBox.SetCurSel(ret);
			return;
		}

		// 删除叠加
		if (strText.IsEmpty())
		{
			_osdIdComboBox.DeleteString(index);
			_osdIdComboBox.SetCurSel(0);
		}
	}
}

void CPreviewDialog::OnBnClickedButtonPreviewStartLocalrecord()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strFile;
	GetDlgItemText(IDC_EDIT_PREVIEW_LOCAL_FILE, strFile);
	if (strFile.IsEmpty())
	{
		AfxMessageBox(L"本地录像文件名称不能为空");
		return;
	}

	CString strType;
	GetDlgItemText(IDC_EDIT_PREVIEW_LOCALRECORD_TYPE, strType);
	if (strType.IsEmpty())
	{
		AfxMessageBox(L"本地录像类型不能为空");
		return;
	}

	CString strPackageSize;
	GetDlgItemText(IDC_EDIT_PREVIEW_PACKAGESIZE, strPackageSize);
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

void CPreviewDialog::OnBnClickedButtonPreviewStopLocalrecord()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopLocalRecord(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_StopLocalRecord（停止本地录像）", ret > VIDEO_ERR_SUCCESS ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewChangleStreamtype()
{
	// TODO: 在此添加控件通知处理程序代码
	CString url;
	GetDlgItemText(IDC_EDIT_PREVIEW_URL, url);
	if (url.IsEmpty())
	{
		AfxMessageBox(L"预览取流URL不能为空");
		return;
	}

	bool isAsyn = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISASYN))->GetCheck();
	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_ChangeStreamType(_playHandle, isAsyn ? 1 : 0, T2A(url));
	costs = GetTickCount64() - costs;
	_printMsg("Video_ChangeStreamType（切换主子码流）", ret, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewPrivateOpen()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strMainType;
	GetDlgItemText(IDC_EDIT_PREVIEW_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"私有数据主类型不能为空");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_PREVIEW_SUBTYPE, strSubType);
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

void CPreviewDialog::OnBnClickedButtonPreviewPrivateClose()
{
	// TODO: 在此添加控件通知处理程序代码
	CString strMainType;
	GetDlgItemText(IDC_EDIT_PREVIEW_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"私有数据主类型不能为空");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_PREVIEW_SUBTYPE, strSubType);
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

void CPreviewDialog::NotifyDialogInited(const char* exeFolder)
{
	_exefold = nullptr == exeFolder ? "" : exeFolder;
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.Activate(TRUE);
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_GPU), L"是否启用GPU硬解，勾选启用，否则不启用，注意开启硬解后无法回调YUV数据，硬解下不建议使用抓图功能");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISASYN), L"是否启用异步模式，启用后将使用异步预览接口预览");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISUSEHWND), L"是否显示画面，勾选显示，否则不显示");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISUSEYUV), L"是否回调YUV数据，勾选回调，否则不回调，注意开启硬解后无法回调YUV数据");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISUSESTREAM), L"是否回调码流数据，勾选回调，否则不回调");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_ISUSEMSG), L"是否回调消息，勾选回调，否则不回调");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_URL), L"请填入预览URL，每次预览前请重新查询URL"); 
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_PLAY), L"发起同步或异步预览（Video_StartPreview/Video_StartAsynPreview，取流、取YUV）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_STOP), L"停止预览（Video_StopPreview，取流、取YUV）");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISBMP), L"使用抓BMP位图，勾选则抓位图，否则抓JPG图片");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_SNAP), L"播放抓图（Video_Snap，只有窗口上呈现出画面时才能抓图，也即收到播放开始消息后才能使用）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_SNAL_FILE), L"绝对路径文件名称，不包含后缀");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_OPENSOUND), L"打开声音（Video_SoundCtrl，只有在窗口上呈现出画面时才能打开声音，也即收到播放开始消息后才能使用）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_CLOSESOUND), L"关闭声音（Video_SoundCtrl）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_VIDEO_DETAIL), L"获取视频详情（Video_GetVideoInfo，包括分辨率、码流、帧率、编码类型、封装类型，只有在窗口上呈现出画面时才能获取视频详情，也即收到播放开始消息后才能使用）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_GETVOLUME), L"获取音量（Video_GetVolume，只有打开声音后才能使用，范围为[0 100]）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_SETVOLUME), L"设置音量（Video_SetVolume，只有打开声音后才能使用，范围为[0 100]，超出范围SDK内部将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_VOLUME), L"音量值，获取的音量在此显示");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_VOLUME_SETVALUE), L"音量值，范围为[0 100]，超出范围使用边界值");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_X), L"请填入字符叠加起点的横坐标");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_Y), L"请填入字符叠加起点的纵坐标"); 
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_FONTSIZE), L"请填入字符叠加字号大小（默认值0表示字号12）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_BOLD), L"字体是否加粗（1-加粗 0-非加粗 其它值-参数错误）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_R), L"请填入字符叠加字体颜色R分量（取值范围[0 255]，超出将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_G), L"请填入字符叠加字体颜色G分量（取值范围[0 255]，超出将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_B), L"请填入字符叠加字体颜色B分量（取值范围[0 255]，超出将使用边界值）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_ALIGN), L"多行字符串叠加时各行的对齐方式（0-居左对齐 1-居中对齐 2-居右对齐）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_TEXT), L"请填入待叠加字符串，支持换行");
	_toolTip.AddTool(GetDlgItem(IDC_COMBO_PREVIEW_OSD_ID), L"请选择叠加ID（新增叠加选中0，修改或删除选择大于0的值）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_SETOSD), L"发起字符叠加（Video_SetOSDText，id填0表示新增叠加，新增叠加后返回大于0的叠加id，修改叠加时选择对应的id并修改叠加的字符串等参数，删除叠加时选择对应的id并修改字符串为空字符串即可；最多可新增叠加三次");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_LOCALRECORD_TYPE), L"本地录像类型：0-普通本地录像（不转封装，直接码流存文件，录像文件需要使用专用播放器播放，大华SDK接入设备下载的录像需使用大华播放器播放，海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入设备使用海康播放器播放） 1-转封装，但只要音频或视频不支持则返回失败，错误码为不支持 2-转封装，但如果音频或视频不支持则按不转封装处理 3-转封装，但如果音频不支持视频支持则只转视频，如果都不支持则返回失败，错误码为不支持；一般来说，海康SDK、EHOME/ISUP、ONVIF协议接入设备的视频是支持转封装的，GB28181、大华SDK协议接入设备的视频是不支持转封装的");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_LOCAL_FILE), L"本地录像的绝对路径录像文件名称，必须包括mp4后缀"); 
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_PACKAGESIZE), L"本地录像分包大小（指达到一定大小后重新生成一个文件存码流数据），单位为字节；实际文件的大小不一定和指定的大小相等，可能大一点也可能小一点，这是正常现象；Demo默认500MB");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_START_LOCALRECORD), L"开启本地录像（Video_StartLocalRecord）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_STOP_LOCALRECORD), L"停止本地录像（Video_StopLocalRecord）");	
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_CHANGLE_STREAMTYPE), L"切换主子码流（Video_ChangleStreamType，必须在预览成功后才能使用，如果是同步模式，接口返回值就是切换结果；如果是异步模式，切换成功不会回调消息，切换失败会回调异步发起取流失败消息，消息码为51）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_PRIVATE_OPEN), L"显示私有数据（Video_PrivateDataCtrl，针对海康设备，这些设备可以以海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入；对于没有子类型的私有数据，各主类型之间可以使用“|”来实现调一次接口控制多个类型，但对于有子类型的，必须对主类型一个一个来控制，其中主类型的各个子类型可以使用“|”实现调一次接口控制同一主类型的多个子类型）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_PRIVATE_CLOSE), L"隐藏私有数据（Video_PrivateDataCtrl，针对海康设备，这些设备可以以海康SDK、EHOME/ISUP、ONVIF、GB28181协议接入；对于没有子类型的私有数据，各主类型之间可以使用“|”来实现调一次接口控制多个类型，但对于有子类型的，必须对主类型一个一个来控制，其中主类型的各个子类型可以使用“|”实现调一次接口控制同一主类型的多个子类型）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_MAINTYPE), L"私有数据主类型，0x0001-智能分析 0x0002-移动侦测 0x0004-POS信息后叠加 0x0008-图片叠加 0x0010-热成像信息 0x0020-温度信息（十进制主类型可选范围为1~63）；对于0x0010（热成像信息），子类型定义为0x0001-点火框显示 0x0002-最高温度 0x0004-最高温度位置 0x0008-最高温度距离（十进制主类型可选范围为1~15）；对于0x0020（温度信息），子类型定义为0x0001-框测温 0x0002-线测温 0x0004-点测温（十进制主类型可选范围为1~7）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_SUBTYPE), L"私有数据子类型，对于0x0010（热成像信息），子类型定义为0x0001-点火框显示 0x0002-最高温度 0x0004-最高温度位置 0x0008-最高温度距离（十进制主类型可选范围为1~15）；对于0x0020（温度信息），子类型定义为0x0001-框测温 0x0002-线测温 0x0004-点测温（十进制主类型可选范围为1~7）");
	_initData();
}

BOOL CPreviewDialog::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}

LRESULT CPreviewDialog::OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam)
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
		}
			break;
		case CALLBACK_STREAM:
		{
			USES_CONVERSION;
			_streamInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_PREVIEW_STREAM, _streamInfo);
		}
			break;
		case CALLBACK_YUV:
		{
			USES_CONVERSION;
			_yuvInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_PREVIEW_YUV, _yuvInfo);
		}
			break;
		default:
			break;
		}

		delete str;
	}

	return 0;
}

void CPreviewDialog::cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void * pUserData)
{
	CPreviewDialog* pThis = reinterpret_cast<CPreviewDialog*>(pUserData);
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
		case 30:
			str = "即时回放播放开始";
			break;
		case 31:
			str = "即时回放播放结束";
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

void CPreviewDialog::cb_streamCallback(VIDEO_INT64 i64PlayHandle, int iStreamDataType, const char * pDataArray, int iDataLen, void * pUserData)
{
	CPreviewDialog* pThis = reinterpret_cast<CPreviewDialog*>(pUserData);
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

void __stdcall CPreviewDialog::cb_decodedDataCallback(VIDEO_INT64 i64PlayHandle, const char* pDataArray, int iDataLen, int iWidth, int iHeight, int iFrameType, int iTimeStamp, void* pUserData)
{
	CPreviewDialog* pThis = reinterpret_cast<CPreviewDialog*>(pUserData);
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

void CPreviewDialog::_initData()
{
	// 需要禁用一些控件
	((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEHWND))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSESTREAM))->SetCheck(BST_CHECKED); 
	((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEYUV))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_ISUSEMSG))->SetCheck(BST_CHECKED);

	USES_CONVERSION;
	_snapPicAbsoluteFileName = A2T(std::string(_exefold + "/preview_picture").c_str());
	_localRecordAbsoluteFileName = A2T(std::string(_exefold + "/preview_localRecord.mp4").c_str());
	SetDlgItemText(IDC_EDIT_PREVIEW_SNAL_FILE, _snapPicAbsoluteFileName);
	SetDlgItemText(IDC_EDIT_PREVIEW_LOCAL_FILE, _localRecordAbsoluteFileName);

	_osdIdComboBox.InsertString(0, L"0");  // iId 从1开始
	_osdIdComboBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdIdComboBox.SetCurSel(0);
}

void CPreviewDialog::_printMsg(const std::string& func, int ret, int errorCode, ULONGLONG costs)
{
	char buffer[512] = { 0 };
	sprintf_s(buffer, "%s执行%s，耗时%I64d毫秒，错误码为%d", func.c_str(), ret != VIDEO_ERR_SUCCESS ? "失败" : "成功", costs, errorCode);

	if (_msgList.GetCount() > 100)
	{
		_msgList.ResetContent();
	}

	USES_CONVERSION;
	_msgList.InsertString(0, A2T(buffer));

    _showListHovScollBar();
}

void CPreviewDialog::_printMsg(const std::string & msg)
{
	if (_msgList.GetCount() > 100)
	{
		_msgList.ResetContent();
	}

	USES_CONVERSION;
	_msgList.InsertString(0, A2T(msg.c_str()));

    _showListHovScollBar();
}

void CPreviewDialog::_showListHovScollBar()
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

void CPreviewDialog::OnLbnDblclkListPlaybackMsgbox()
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

