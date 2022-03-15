
// DemoDlg.cpp : 实现文件
//

#include "stdafx.h"
#include "Demo.h"
#include "DemoDlg.h"
#include "afxdialogex.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


CDemoDlg::CDemoDlg(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DEMO_DIALOG, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CDemoDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_TAB1, _tabDialog);
}

BEGIN_MESSAGE_MAP(CDemoDlg, CDialog)
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_NOTIFY(TCN_SELCHANGE, IDC_TAB1, OnTabSelChange)
END_MESSAGE_MAP()


// CDemoDlg 消息处理程序

BOOL CDemoDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	// 设置此对话框的图标。  当应用程序主窗口不是对话框时，框架将自动
	//  执行此操作
	SetIcon(m_hIcon, TRUE);			// 设置大图标
	SetIcon(m_hIcon, FALSE);		// 设置小图标

	// TODO: 在此添加额外的初始化代码
	_tabDialog.InsertItem(DIALOG_TAB_INIT, L"初始化与反初始化");
	_tabDialog.InsertItem(DIALOG_TAB_PREVIEW, L"实时预览");
	_tabDialog.InsertItem(DIALOG_TAB_PLAYBACK, L"录像回放");
	_tabDialog.InsertItem(DIALOG_TAB_FILEPLAY, L"文件播放");
	_tabDialog.InsertItem(DIALOG_TAB_DOWNLOAD, L"录像下载");
	_tabDialog.InsertItem(DIALOG_TAB_TALK, L"语音对讲");
	_initDialog.Create(IDD_DIALOG_INIT, &_tabDialog);
	_previewDialog.Create(IDD_DIALOG_PREVIEW, &_tabDialog);
	_recordPlayDialog.Create(IDD_DIALOG_PLAYBACK, &_tabDialog);
	_filePlayDialog.Create(IDD_DIALOG_FILEPLAY, &_tabDialog);
	_downloadDialog.Create(IDD_DIALOG_DOWNLOAD, &_tabDialog);
	_talkDialog.Create(IDD_DIALOG_TALK, &_tabDialog);	

	CRect rect;
	_tabDialog.GetClientRect(&rect);
	rect.top += 20;
	rect.bottom -= 5;
	rect.left += 5;
	rect.right -= 5;

	_initDialog.MoveWindow(rect.TopLeft().x, rect.TopLeft().y, rect.Width(), rect.Height());
	_previewDialog.MoveWindow(rect.TopLeft().x, rect.TopLeft().y, rect.Width(), rect.Height());
	_recordPlayDialog.MoveWindow(rect.TopLeft().x, rect.TopLeft().y, rect.Width(), rect.Height());
	_filePlayDialog.MoveWindow(rect.TopLeft().x, rect.TopLeft().y, rect.Width(), rect.Height());
	_downloadDialog.MoveWindow(rect.TopLeft().x, rect.TopLeft().y, rect.Width(), rect.Height());
	_talkDialog.MoveWindow(rect.TopLeft().x, rect.TopLeft().y, rect.Width(), rect.Height());
	_initDialog.ShowWindow(SW_SHOW);
	_previewDialog.ShowWindow(SW_HIDE);
	_recordPlayDialog.ShowWindow(SW_HIDE);
	_filePlayDialog.ShowWindow(SW_HIDE);
	_downloadDialog.ShowWindow(SW_HIDE);
	_talkDialog.ShowWindow(SW_HIDE);

	_dialogMp[DIALOG_TAB_INIT] = &_initDialog;
	_dialogMp[DIALOG_TAB_PREVIEW] = &_previewDialog;
	_dialogMp[DIALOG_TAB_PLAYBACK] = &_recordPlayDialog;
	_dialogMp[DIALOG_TAB_FILEPLAY] = &_filePlayDialog;
	_dialogMp[DIALOG_TAB_DOWNLOAD] = &_downloadDialog;
	_dialogMp[DIALOG_TAB_TALK] = &_talkDialog;

	std::string exeFolder = GetCurrentExeFolder();
	_initDialog.NotifyDialogInited(exeFolder.c_str());
	_previewDialog.NotifyDialogInited(exeFolder.c_str());
	_recordPlayDialog.NotifyDialogInited(exeFolder.c_str());
	_filePlayDialog.NotifyDialogInited(exeFolder.c_str());
	_downloadDialog.NotifyDialogInited(exeFolder.c_str());
	_talkDialog.NotifyDialogInited(exeFolder.c_str());

	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
	_toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.AddTool(GetDlgItem(IDC_TAB1), L"使用视频SDK各功能请先在“初始化与反初始化”中初始化视频SDK，如不在使用视频SDK，请反初始化");

	return TRUE;  // 除非将焦点设置到控件，否则返回 TRUE
}

// 如果向对话框添加最小化按钮，则需要下面的代码
//  来绘制该图标。  对于使用文档/视图模型的 MFC 应用程序，
//  这将由框架自动完成。

void CDemoDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // 用于绘制的设备上下文

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// 使图标在工作区矩形中居中
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// 绘制图标
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialog::OnPaint();
	}
}

//当用户拖动最小化窗口时系统调用此函数取得光标
//显示。
HCURSOR CDemoDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CDemoDlg::OnTabSelChange(NMHDR * pNMHDR, LRESULT * pResult)
{
	int tabIndex = _tabDialog.GetCurSel();
	for (auto& it : _dialogMp)
	{
		if (it.second != nullptr)
		{
			if (tabIndex == it.first)
			{
				it.second->ShowWindow(SW_SHOW);
				continue;
			}

			it.second->ShowWindow(SW_HIDE);
		}
	}
}

std::string CDemoDlg::ReplaceStr(const std::string& src, const std::string& oldStr, const std::string& newStr)
{
	std::string tmp = src;
	std::string::size_type pos = std::string::npos;
	while ((pos = tmp.find(oldStr)) != std::string::npos)
	{
		tmp.replace(pos, oldStr.length(), newStr);
	}

	return tmp;
}

std::string CDemoDlg::GetCurrentExeFolder()
{
	char buffer[MAX_PATH * 5] = { 0 };
	GetModuleFileNameA(nullptr, buffer, MAX_PATH * 5);
	std::string folder = std::string(buffer);
	folder = ReplaceStr(folder, "\\", "/");
	std::string::size_type pos = folder.rfind("/");
	return std::string::npos == pos ? std::string() : folder.substr(0, pos);
}

void CDemoDlg::OnClose()
{
	Video_Fini();
	CDialog::OnClose();
}

BOOL CDemoDlg::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}
