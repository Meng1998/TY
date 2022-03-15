// DownloadEx.cpp : ʵ���ļ�
//

#include "stdafx.h"
#include "Demo.h"
#include "DownloadDialog.h"
#include "afxdialogex.h"


// CDownloadEx �Ի���

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
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_START), L"��ʼ¼�����أ�Video_StartDownload���յ����ؽ��������ض���������ʧ����Щ��Ϣ��Ҫֹͣ�������ͷ���Դ��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_STOP), L"ֹͣ¼�����أ�Video_StopDownload��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_PAUSE), L"��ͣ¼�����أ�Video_PlayCtrl��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_DL_RESUME), L"�ָ�¼�����أ�Video_PlayCtrl��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DL_URL), L"������ط�URL");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DOWNLOAD_TYPE), L"¼�����ͣ���䡰0�������-��ͨ¼�����أ���1��-¼��ת��װ�������Ƶ����Ƶ��֧����ص���֧����Ϣ ��2�� - ¼��ת��װ������Ƶ����Ƶ��֧��ʱ����ת��װ���� ��3��-¼��ת��װ�������Ƶ��֧����ֻת��Ƶ�������ƵҲ��֧����ص���֧����Ϣ ��4��-���öϵ����� ����ֵ-�������󣨶���ָ��¼��ת��װ�����öϵ�������Ŀǰ��֧�ֺ���SDKЭ�顢EHOMEЭ������豸�����������Э�������豸����ص���֧�ֵ���Ϣ�����ڶϵ�������ֻ֧��δת��װ��¼�񣻵�¼������ʱ�����Ȳ�ѯ�豸����Э�飬�Ǻ���SDK��EHOMEЭ�鲻������䡰0�����ɣ�ת��װ�ǽ���Ƶת���ɱ�׼MP4�ļ���������ͨ�ò������ϲ��ţ��粻ת��װ����Ҫר�ò��������ţ����SDK�����豸���ص�¼����Ҫ�󻪲�����������SDKЭ��/EHOMEЭ������¼����Ҫ�������������ţ�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DL_TOTAL), L"������ѯ�ط�URLʱ��ѯ���ĸ�¼��Ƭ�δ�С֮��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DL_FILESIZE), L"¼��ְ���С��ָ�ﵽһ����С����������һ���ļ����������ݣ�����λΪ�ֽڣ�ʵ���ļ��Ĵ�С��һ����ָ���Ĵ�С��ȣ����ܴ�һ��Ҳ����Сһ�㣬������������DemoĬ��500MB");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_S_DATE), L"������ѯ�ط�URLʱ�Ĳ�ѯ��ʼʱ��");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_S_TIME), L"������ѯ�ط�URLʱ�Ĳ�ѯ��ʼʱ��");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_E_DATE), L"������ѯ�ط�URLʱ�Ĳ�ѯ����ʱ��");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_DL_E_TIME), L"������ѯ�ط�URLʱ�Ĳ�ѯ����ʱ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_DOWNLOAD_FILENAME), L"��ָ����׺mp4���硰E:\\test.mp4����pszFileNameΪansi�����ַ�����·�����ļ����Ʋ��ܰ��������ַ�����Ӣ���µġ�*������ | ���Լ�Ӣ���µġ� ? ���������⣬·�������á�.���͡�..����¼�����ز�֧�����ص�����λ��, ֻ�����ص����ء�����pstDownloadReq��ָ���ϵ�����ʱ���봫���ϴ�¼������������ɵ�һ���ļ��ľ���·���ļ����ƣ������֧�ֻ�ͨ���ص�������Ϣ");

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
		_printMsg("��ǰ��������״̬������ֹͣ��ǰ����");
		return;
	}

	UpdateData(TRUE);
	CString str;
	GetDlgItemText(IDC_EDIT_DL_URL, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"�ط�ȡ��URL����Ϊ��");
		return;
	}

	CString downloadType;
	GetDlgItemText(IDC_EDIT_DOWNLOAD_TYPE, downloadType);
	if (downloadType.IsEmpty())
	{
		AfxMessageBox(L"�������Ͳ���Ϊ��");
		return;
	}

	CString downloadFileName;
	GetDlgItemText(IDC_EDIT_DOWNLOAD_FILENAME, downloadFileName);
	if (downloadFileName.IsEmpty())
	{
		AfxMessageBox(L"���ؾ���·���ļ����Ʋ���Ϊ��");
		return;
	}

	CString allSize;
	GetDlgItemText(IDC_EDIT_DL_TOTAL, allSize);
	if (allSize.IsEmpty())
	{
		AfxMessageBox(L"¼���ܴ�С����Ϊ��");
		return;
	}

	CString packageSize;
	GetDlgItemText(IDC_EDIT_DL_FILESIZE, packageSize);
	if (packageSize.IsEmpty())
	{
		AfxMessageBox(L"¼��ְ���С����Ϊ��");
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
	_printMsg("Video_StartDownload����ʼ���أ�", _i64DownloadHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), GetTickCount64() - beginTime);
}

void CDownloadDialog::OnBnClickedButtonDlStop()
{
	// TODO: Add your control notification handler code here
	ULONGLONG beginTime = GetTickCount64();
	int ret = Video_StopDownload(_i64DownloadHandle);
	_i64DownloadHandle = -1;      // ���Ǵ��ľ�����ԣ�����ֹͣ����ʼ���ǳɹ���
	_printMsg("Video_StopDownload��ֹͣ���أ�", ret, Video_GetLastError(), GetTickCount64() - beginTime);

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
	_printMsg("Video_PlayCtrl����ͣ���أ�", iRet, Video_GetLastError(), GetTickCount64() - beginTime);
}

void CDownloadDialog::OnBnClickedButtonDlResume()
{
	// TODO: Add your control notification handler code here
	ULONGLONG beginTime = GetTickCount64();
	int iRet = Video_PlayCtrl(_i64DownloadHandle, 5, 0);
	_printMsg("Video_PlayCtrl���ָ����أ�", iRet, Video_GetLastError(), GetTickCount64() - beginTime);
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
	sprintf_s(buffer, "%sִ��%s����ʱ%I64d���룬������Ϊ%d", func.c_str(), ret != VIDEO_ERR_SUCCESS ? "ʧ��" : "�ɹ�", costs, errorCode);

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
			sprintf_s(buffer, "��ʼ¼�����أ���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 1:
			sprintf_s(buffer, "¼�������У���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 2:
			sprintf_s(buffer, "¼��������ɣ���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 3:
			sprintf_s(buffer, "¼�����ؼ����ְ�����Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 4:
			sprintf_s(buffer, "¼�����طְ�ʧ�ܣ���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 5:
			sprintf_s(buffer, "¼�����طְ���ɣ���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 6:
			sprintf_s(buffer, "¼������ʱ��������Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 30:
			sprintf_s(buffer, "¼������ת��װ��֧�֣���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 50:
			sprintf_s(buffer, "¼�����ضϵ�������֧�֣���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		case 100:
			sprintf_s(buffer, "¼������ʧ�ܣ���Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
			break;
		default:
			sprintf_s(buffer, "����������Ϣ����Ϊ%d,��ǰ���ȣ�%0.2f%%", iMsg, fPercent);
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
