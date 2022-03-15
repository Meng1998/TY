// TalkDialog.cpp : ʵ���ļ�
//

#include "stdafx.h"
#include "Demo.h"
#include "TalkDialog.h"
#include "afxdialogex.h"


// CTalkDialog �Ի���

IMPLEMENT_DYNAMIC(CTalkDialog, CDialog)

CTalkDialog::CTalkDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_TALK, pParent)
{

}

CTalkDialog::~CTalkDialog()
{
}

void CTalkDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_LIST_TALK_MSG, _msgList);
}


BEGIN_MESSAGE_MAP(CTalkDialog, CDialog)
	
	ON_BN_CLICKED(IDC_BUTTON_START_TALK, &CTalkDialog::OnBnClickedButtonStartTalk)
	ON_BN_CLICKED(IDC_BUTTON_STOP_TALK2, &CTalkDialog::OnBnClickedButtonStopTalk2)
	ON_MESSAGE(MSG_UPDATE_CALLBACKINFO, &CTalkDialog::OnUpdateCallbackInfo)
	ON_LBN_DBLCLK(IDC_LIST_TALK_MSG, &CTalkDialog::OnLbnDblclkListTalkMsgbox)
END_MESSAGE_MAP()

void CTalkDialog::OnBnClickedButtonStartTalk()
{
	// TODO: Add your control notification handler code here
	CString talkURL;
	GetDlgItemText(IDC_EDIT_TALK_URL, talkURL);
	if (talkURL.IsEmpty())
	{
		AfxMessageBox(L"�Խ�URL����Ϊ��");
		return;
	}
    //�Ƿ�ͬ��
    bool isAsyn = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_SYNTALK))->GetCheck();

	USES_CONVERSION;
	std::string url = T2A(talkURL);
	url = StringTrim(url, " ");
	ULONGLONG beginTime = GetTickCount64();
	int iRet = isAsyn ? Video_StartTalk(url.c_str(), nullptr, CTalkDialog::cb_TalkMsg, this) : Video_StartAsynTalk(url.c_str(), nullptr, CTalkDialog::cb_TalkMsg, this);
    std::string szMsg = isAsyn ? "Video_StartTalk��ͬ����ʼ�����Խ���" : "Video_StartAsynTalk���첽��ʼ�����Խ���";
	_printMsg(szMsg, iRet, Video_GetLastError(), GetTickCount64() - beginTime);
}

void CTalkDialog::NotifyDialogInited(const char* exeFolder)
{
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.Activate(TRUE);
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_START_TALK), L"�����Խ���Video_StartAsynTalk����ƵSDKͬһʱ��ֻ֧��һ·�����Խ���");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_STOP_TALK2), L"ֹͣ�����Խ���Video_StopTalk��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_TALK_URL), L"�����Խ�ȡ��URL��ÿ�ζԽ���Ҫ����URL");
    _toolTip.AddTool(GetDlgItem(IDC_CHECK_SYNTALK), L"��ѡ��ͬ���Խ���Video_StartTalk��������ѡ���첽�Խ���Video_StartAsynTalk��");
}

void CTalkDialog::OnBnClickedButtonStopTalk2()
{
	// TODO: Add your control notification handler code here
	ULONGLONG beginTime = GetTickCount64();
	int iRet = Video_StopTalk();
	_printMsg("Video_StopTalk��ֹͣ�Խ���", iRet, Video_GetLastError(), GetTickCount64() - beginTime);
}

void CTalkDialog::OnLbnDblclkListTalkMsgbox()
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

void CTalkDialog::_printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs)
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

void CTalkDialog::_printMsg(const std::string& msg)
{
	if (_msgList.GetCount() > 100)
	{
		_msgList.ResetContent();
	}

	USES_CONVERSION;
	_msgList.InsertString(0, A2T(msg.c_str()));
    _showListHovScollBar();
}

void CTalkDialog::_showListHovScollBar()
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

void CTalkDialog::cb_TalkMsg(VIDEO_INT64 i64PlayHandle, int iMsg, void* pUserData)
{
	CTalkDialog* pThis = reinterpret_cast<CTalkDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}	

	pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, iMsg, 0);
}

BOOL CTalkDialog::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}

LRESULT CTalkDialog::OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam)
{
	int msgId = (int)wparam;
	if (10 == msgId)
	{
		char buffer[64] = { 0 };
		sprintf_s(buffer, "�����Խ���ʼȡ������Ϣ����Ϊ%d", msgId);
		_printMsg(buffer);
		return 0;
	}

	if (12 == msgId)
	{
		char buffer[64] = { 0 };
		sprintf_s(buffer, "�����Խ��쳣����Ϣ����Ϊ%d", msgId);
		_printMsg(buffer);
	}

    if (51 == msgId)
    {
        char buffer[64] = { 0 };
        sprintf_s(buffer, "�첽�����Խ�ȡ��ʧ�ܣ���Ϣ����Ϊ%d", msgId);
        _printMsg(buffer);
    }

    if (50 == msgId)
    {
        char buffer[64] = { 0 };
        sprintf_s(buffer, "�첽�����Խ�ȡ���ɹ�����Ϣ����Ϊ%d", msgId);
        _printMsg(buffer);
    }

	return 0;
}
