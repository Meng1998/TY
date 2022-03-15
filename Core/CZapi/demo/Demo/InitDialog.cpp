// InitDialog.cpp : ʵ���ļ�
//

#include "stdafx.h"
#include "Demo.h"
#include "InitDialog.h"
#include "afxdialogex.h"
#define MAX_BUFFER_SIZE 1024

// CInitDialog �Ի���

IMPLEMENT_DYNAMIC(CInitDialog, CDialog)

CInitDialog::CInitDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_INIT, pParent)
{

}

CInitDialog::~CInitDialog()
{
}

void CInitDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_LIST_INIT_MSG, _msgList);
}


BEGIN_MESSAGE_MAP(CInitDialog, CDialog)
	ON_BN_CLICKED(IDC_BUTTON_INIT, &CInitDialog::OnBnClickedButtonInit)
	ON_BN_CLICKED(IDC_BUTTON_UNINIT, &CInitDialog::OnBnClickedButtonUninit)
	ON_MESSAGE(MSG_UPDATE_TOKEN, &CInitDialog::OnNotifyUpdateToken)
	ON_LBN_DBLCLK(IDC_LIST_INIT_MSG, &CInitDialog::OnLbnDblclkListPlaybackMsgbox)
	ON_WM_CREATE()
	ON_WM_DESTROY()
END_MESSAGE_MAP()


// CInitDialog ��Ϣ�������

int CInitDialog::OnCreate(LPCREATESTRUCT lpCreateStruct)
{	
	return CDialog::OnCreate(lpCreateStruct);
}

void CInitDialog::_printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs)
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

void CInitDialog::_printMsg(const std::string& msg)
{
	if (_msgList.GetCount() > 100)
	{
		_msgList.ResetContent();
	}

	USES_CONVERSION;
	_msgList.InsertString(0, A2T(msg.c_str()));

    _showListHovScollBar();
}

void CInitDialog::_showListHovScollBar()
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

void CInitDialog::OnBnClickedButtonInit()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_Init(nullptr);	
	costs = GetTickCount64() - costs;
	_printMsg("Video_Init����ʼ����", ret, Video_GetLastError(), costs);
}

void CInitDialog::OnBnClickedButtonUninit()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_Fini();
	costs = GetTickCount64() - costs;
	_printMsg("Video_Fini������ʼ����", ret, Video_GetLastError(), costs);
}

LRESULT CInitDialog::OnNotifyUpdateToken(WPARAM wparam, LPARAM lparam)
{
	_printMsg("өʯtoken�������ڣ��뾡���ѯ�µ�өʯtoken��������token");
	return 0;
}

void CInitDialog::NotifyDialogInited(const char* exeFolder)
{
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);	
	_toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_INIT), L"ʹ��Video_Init��ʼ��SDK���������ȳ�ʼ�����ظ���ʼ�����سɹ�");	
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_UNINIT), L"ʹ��Video_Fini����ʼ��SDK���ظ�����ʼ�����سɹ�");
}

BOOL CInitDialog::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}

void CInitDialog::OnDestroy()
{
	Video_Fini();
}

void CInitDialog::OnLbnDblclkListPlaybackMsgbox()
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
