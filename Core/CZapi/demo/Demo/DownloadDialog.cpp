// DownloadEx.cpp : 实现文件
//

#include "stdafx.h"
#include "Demo.h"
#include "DownloadDialog.h"
#include "afxdialogex.h"


// CDownloadEx 对话框

IMPLEMENT_DYNAMIC(CDownloadDialog, CDialog)

CDownloadDialog::CDownloadDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_DOWNLOAD, pParent)
	, _downloadFileName(_T(""))
	, _i64RecordSize(0)
	, _i64MaxFileSize(500*1024*1024)
	, _playbackUrl(_T(""))
	, _downLoadType(_T("0"))
	, _downloadMsg(_T(""))
{

}

CDownloadDialog::~CDownloadDialog()
{
}

void CDownloadDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_LIST_DL_MSG, _msgList);
	DDX_Text(pDX, IDC_EDIT_DOWNLOAD_FILENAME, _downloadFileName);
	DDX_Control(pDX, IDC_DATETIMEPICKER_DL_S_DATE, _startDateCtrl);
	DDX_Control(pDX, IDC_DATETIMEPICKER_DL_S_TIME, _startTimeCtrl);
	DDX_Control(pDX, IDC_DATETIMEPICKER_DL_E_DATE, _endDateCtrl);
	DDX_Control(pDX, IDC_DATETIMEPICKER_DL_E_TIME, _endTimeCtrl);
	DDX_Text(pDX, IDC_EDIT_DL_TOTAL, _i64RecordSize);
	DDX_Text(pDX, IDC_EDIT_DL_FILESIZE, _i64MaxFileSize);
	DDX_Text(pDX, IDC_EDIT_DL_URL, _playbackUrl);
	DDX_Text(pDX, IDC_EDIT_DOWNLOAD_TYPE, _downLoadType);
	DDX_Text(pDX, IDC_EDIT_DOWNLOAD_MSG, _downloadMsg);
}

BEGIN_MESSAGE_MAP(CDownloadDialog, CDialog)
	ON_BN_CLICKED(IDC_BUTTON_DL_START, &CDownloadDialog::OnBnClickedButtonDlStart)
	ON_BN_CLICKED(IDC_BUTTON_DL_STOP, &CDownloadDialog::OnBnClickedButtonDlStop)
	ON_BN_CLICKED(IDC_BUTTON_DL_PAUSE, &CDownloadDialog::OnBnClickedButtonDlPause)
	ON_BN_CLICKED(IDC_BUTTON_DL_RESUME, &CDownloadDialog::OnBnClickedButtonDlResume)
	ON_LBN_DBLCLK(IDC_LIST_DL_MSG, &CDownloadDialog::OnLbnDblclkListDownloadMsgbox)
	ON_MESSAGE(MSG_UPDATE_CALLBACKINFO, &CDownloadDialog::OnUpdateCallbackInfo)
END_MESSAGE_MAP()

void CDownloadDialog::NotifyDialogInited(const char* exeFolder)
{
	_exefold = nullptr == exeFolder ? "" : exeFolder;
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
	_toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_START), L"开始录像下载（Video_StartDownload，收到下载结束、下载断流、下载失败这些消息需要停止下载以释放资源）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_STOP), L"停止录像下载（Video_StopDownload）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_PAUSE), L"暂停录像下载（Video_PlayCtrl）");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_RESUME), L"恢复录像下载（Video_PlayCtrl）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DL_URL), L"请填入回放URL");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DOWNLOAD_TYPE), L"录像类型，填充“0”或不填充-普通录像下载，“1”-录像转封装，如果音频或视频不支持则回调不支持消息 “2” - 录像转封装，但音频或视频不支持时按不转封装处理 “3”-录像转封装，如果音频不支持则只转视频，如果视频也不支持则回调不支持消息 “4”-启用断点续传 其它值-参数错误（对于指定录像转封装和启用断点续传，目前仅支持海康SDK协议、EHOME协议接入设备，如果是其它协议接入的设备，会回调不支持的消息；对于断点续传，只支持未转封装的录像；调录像下载时可以先查询设备接入协议，非海康SDK、EHOME协议不填充或填充“0”即可；转封装是将视频转换成标准MP4文件，可以在通用播放器上播放，如不转封装，需要专用播放器播放，如大华SDK接入设备下载的录像需要大华播放器，海康SDK协议/EHOME协议下载录像需要海康播放器播放）");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DL_TOTAL), L"请填充查询回放URL时查询到的各录像片段大小之和");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DL_FILESIZE), L"录像分包大小（指达到一定大小后重新生成一个文件存码流数据），单位为字节；实际文件的大小不一定和指定的大小相等，可能大一点也可能小一点，这是正常现象；Demo默认500MB");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_S_DATE), L"请填充查询回放URL时的查询开始时间");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_S_TIME), L"请填充查询回放URL时的查询开始时间");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_E_DATE), L"请填充查询回放URL时的查询结束时间");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_E_TIME), L"请填充查询回放URL时的查询结束时间");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DOWNLOAD_FILENAME), L"请指定后缀mp4，如“E:\\test.mp4”。pszFileName为ansi编码字符串。路径和文件名称不能包含特殊字符（中英文下的“*”、“ | ”以及英文下的“ ? ”），此外，路径中慎用“.”和“..”。录像下载不支持下载到网络位置, 只能下载到本地。对于pstDownloadReq中指定断点续传时，请传入上次录像下载最后生成的一个文件的绝对路径文件名称，如果不支持会通过回调给出消息");

	USES_CONVERSION;
	_downloadFileName.Empty();
	_downloadFileName.Format(L"%s/download_%lld.mp4", A2T(_exefold.c_str()), GetTickCount64());
	SetDlgItemText(IDC_EDIT_DOWNLOAD_FILENAME, _downloadFileName);

	SYSTEMTIME stTime;
	GetLocalTime(&stTime);
	stTime.wHour = 0;
	stTime.wSecond = 0;
	stTime.wMinute = 0;
	stTime.wMilliseconds = 0;
	_startDateCtrl.SetTime(&stTime);
	_startTimeCtrl.SetTime(&stTime);
	_endDateCtrl.SetTime(&stTime);

	stTime.wHour = 23;
	stTime.wSecond = 59;
	stTime.wMinute = 59;
	stTime.wMilliseconds = 0;
	_endTimeCtrl.SetTime(&stTime);
}

BOOL CDownloadDialog::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}

void CDownloadDialog::OnBnClickedButtonDlStart()
{
	// TODO: Add your control notification handler code here

	if (_i64DownloadHandle > -1)
	{
		_printMsg("当前处于下载状态，请先停止当前下载");
		return;
	}

	UpdateData(TRUE);
	CString str;
	GetDlgItemText(IDC_EDIT_DL_URL, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"回放取流URL不能为空");
		return;
	}

	CString downloadType;
	GetDlgItemText(IDC_EDIT_DOWNLOAD_TYPE, downloadType);
	if (downloadType.IsEmpty())
	{
		AfxMessageBox(L"下载类型不能为空");
		return;
	}

	CString downloadFileName;
	GetDlgItemText(IDC_EDIT_DOWNLOAD_FILENAME, downloadFileName);
	if (downloadFileName.IsEmpty())
	{
		AfxMessageBox(L"下载绝对路径文件名称不能为空");
		return;
	}

	CString allSize;
	GetDlgItemText(IDC_EDIT_DL_TOTAL, allSize);
	if (allSize.IsEmpty())
	{
		AfxMessageBox(L"录像总大小不能为空");
		return;
	}

	CString packageSize;
	GetDlgItemText(IDC_EDIT_DL_FILESIZE, packageSize);
	if (packageSize.IsEmpty())
	{
		AfxMessageBox(L"录像分包大小不能为空");
		return;
	}

	struct tm tmStart;
	memset(&tmStart, 0, sizeof(tmStart));
	struct tm tmEnd;
	memset(&tmEnd, 0, sizeof(tmEnd));
	CTime ctTemp;

	_startDateCtrl.GetTime(ctTemp);
	tmStart.tm_year = ctTemp.GetYear() - 1900;
	tmStart.tm_mon = ctTemp.GetMonth() - 1;
	tmStart.tm_mday = ctTemp.GetDay();
	_startTimeCtrl.GetTime(ctTemp);
	tmStart.tm_hour = ctTemp.GetHour();
	tmStart.tm_min = ctTemp.GetMinute();
	tmStart.tm_sec = ctTemp.GetSecond();
	time_t llStartTime = mktime(&tmStart);

	_endDateCtrl.GetTime(ctTemp);
	tmEnd.tm_year = ctTemp.GetYear() - 1900;
	tmEnd.tm_mon = ctTemp.GetMonth() - 1;
	tmEnd.tm_mday = ctTemp.GetDay();
	_endTimeCtrl.GetTime(ctTemp);
	tmEnd.tm_hour = ctTemp.GetHour();
	tmEnd.tm_min = ctTemp.GetMinute();
	tmEnd.tm_sec = ctTemp.GetSecond();
	time_t llEndTime = mktime(&tmEnd);

	VIDEO_DOWNLOAD_REQ stReq = { 0 };
	stReq.pUserData = this;
	USES_CONVERSION;
	stReq.i64RecordSize = _i64RecordSize;
	stReq.i64FileMaxSize = _i64MaxFileSize;
	stReq.i64StartTimeStamp = llStartTime;
	stReq.i64EndTimeStamp = llEndTime;
	stReq.fnDownload = &CDownloadDialog::cb_download;	
	strcpy_s(stReq.szReserve, T2A(downloadType));
	std::string url = T2A(_playbackUrl);
	std::string fileName = T2A(downloadFileName);
	url = StringTrim(url, " ");

	ULONGLONG beginTime = GetTickCount64();
	_i64DownloadHandle = Video_StartDownload(url.c_str(), fileName.c_str(), &stReq);
	_printMsg("Video_StartDownload（开始下载）", _i64DownloadHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), GetTickCount64() - beginTime);
}

void CDownloadDialog::OnBnClickedButtonDlStop()
{
	// TODO: Add your control notification handler code here
	ULONGLONG beginTime = GetTickCount64();
	int ret = Video_StopDownload(_i64DownloadHandle);
	_i64DownloadHandle = -1;      // 除非传的句柄不对，否则停止下载始终是成功的
	_printMsg("Video_StopDownload（停止下载）", ret, Video_GetLastError(), GetTickCount64() - beginTime);

	if (VIDEO_ERR_SUCCESS == ret)
	{
		USES_CONVERSION;
		_downloadFileName.Empty();
		_downloadFileName.Format(L"%s/download_%lld.mp4", A2T(_exefold.c_str()), GetTickCount64());
		SetDlgItemText(IDC_EDIT_DOWNLOAD_FILENAME, _downloadFileName);
	}
}

void CDownloadDialog::OnBnClickedButtonDlPause()
{
	// TODO: Add your control notification handler code here
	ULONGLONG beginTime = GetTickCount64();
	int iRet = Video_PlayCtrl(_i64DownloadHandle, 4, 0);
	_printMsg("Video_PlayCtrl（暂停下载）", iRet, Video_GetLastError(), GetTickCount64() - beginTime);
}

void CDownloadDialog::OnBnClickedButtonDlResume()
{
	// TODO: Add your control notification handler code here
	ULONGLONG beginTime = GetTickCount64();
	int iRet = Video_PlayCtrl(_i64DownloadHandle, 5, 0);
	_printMsg("Video_PlayCtrl（恢复下载）", iRet, Video_GetLastError(), GetTickCount64() - beginTime);
}

void CDownloadDialog::OnLbnDblclkListDownloadMsgbox()
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

void CDownloadDialog::_printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs)
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

void CDownloadDialog::_printMsg(const std::string& msg)
{
	if (_msgList.GetCount() > 100)
	{
		_msgList.ResetContent();
	}

	USES_CONVERSION;
	_msgList.InsertString(0, A2T(msg.c_str()));
    _showListHovScollBar();
}

void CDownloadDialog::_showListHovScollBar()
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

void CDownloadDialog::cb_download(VIDEO_INT64 i64DownloadHandle, float fPercent, int iMsg, void* pUserData)
{
	CDownloadDialog* pThis = reinterpret_cast<CDownloadDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	auto msgFunc = [](int iMsg, float fPercent) {
		char buffer[512] = { 0 };
		switch (iMsg)
		{
		case 0:
			sprintf_s(buffer, "开始录像下载，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 1:
			sprintf_s(buffer, "录像下载中，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 2:
			sprintf_s(buffer, "录像下载完成，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 3:
			sprintf_s(buffer, "录像下载即将分包，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 4:
			sprintf_s(buffer, "录像下载分包失败，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 5:
			sprintf_s(buffer, "录像下载分包完成，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 6:
			sprintf_s(buffer, "录像下载时断流，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 30:
			sprintf_s(buffer, "录像下载转封装不支持，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 50:
			sprintf_s(buffer, "录像下载断点续传不支持，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		case 100:
			sprintf_s(buffer, "录像下载失败，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		default:
			sprintf_s(buffer, "其它错误，消息类型为%d,当前进度：%0.2f%%", iMsg, fPercent);
			break;
		}

		return std::string(buffer);
	};

	USES_CONVERSION;
	std::string* pstr = new (std::nothrow) std::string();
	*pstr = msgFunc(iMsg, fPercent);
	pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_MSG, reinterpret_cast<LPARAM>(pstr));
}

LRESULT CDownloadDialog::OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam)
{
	std::string* str = reinterpret_cast<std::string*>(lparam);
	if (str != nullptr)
	{
		if (CALLBACK_MSG == wparam)
		{
			USES_CONVERSION;
			_downloadMsg = A2T((*str).c_str());
			UpdateData(FALSE);
		}
		delete str;
	}

	return 0;
}
