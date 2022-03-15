// InitDialog.cpp : 实现文件
//

#include "stdafx.h"
#include "Demo.h"
#include "InitDialog.h"
#include "afxdialogex.h"
#define MAX_BUFFER_SIZE 1024

// CInitDialog 对话框

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


// CInitDialog 消息处理程序

int CInitDialog::OnCreate(LPCREATESTRUCT lpCreateStruct)
{	
	return CDialog::OnCreate(lpCreateStruct);
}

void CInitDialog::_printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs)
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
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_Init(nullptr);	
	costs = GetTickCount64() - costs;
	_printMsg("Video_Init（初始化）", ret, Video_GetLastError(), costs);
}

void CInitDialog::OnBnClickedButtonUninit()
{
	// TODO: 在此添加控件通知处理程序代码
	ULONGLONG costs = GetTickCount64();
	int ret = Video_Fini();
	costs = GetTickCount64() - costs;
	_printMsg("Video_Fini（反初始化）", ret, Video_GetLastError(), costs);
}

LRESULT CInitDialog::OnNotifyUpdateToken(WPARAM wparam, LPARAM lparam)
{
	_printMsg("萤石token即将过期，请尽快查询新的萤石token，并更新token");
	return 0;
}

void CInitDialog::NotifyDialogInited(const char* exeFolder)
{
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);	
	_toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_INIT), L"使用Video_Init初始化SDK，必须首先初始化。重复初始化返回成功");	
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_UNINIT), L"使用Video_Fini反初始化SDK，重复反初始化返回成功");
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
