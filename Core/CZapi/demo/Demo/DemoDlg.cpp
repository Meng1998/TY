
// DemoDlg.cpp : ʵ���ļ�
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


// CDemoDlg ��Ϣ�������

BOOL CDemoDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	// ���ô˶Ի����ͼ�ꡣ  ��Ӧ�ó��������ڲ��ǶԻ���ʱ����ܽ��Զ�
	//  ִ�д˲���
	SetIcon(m_hIcon, TRUE);			// ���ô�ͼ��
	SetIcon(m_hIcon, FALSE);		// ����Сͼ��

	// TODO: �ڴ���Ӷ���ĳ�ʼ������
	_tabDialog.InsertItem(DIALOG_TAB_INIT, L"��ʼ���뷴��ʼ��");
	_tabDialog.InsertItem(DIALOG_TAB_PREVIEW, L"ʵʱԤ��");
	_tabDialog.InsertItem(DIALOG_TAB_PLAYBACK, L"¼��ط�");
	_tabDialog.InsertItem(DIALOG_TAB_FILEPLAY, L"�ļ�����");
	_tabDialog.InsertItem(DIALOG_TAB_DOWNLOAD, L"¼������");
	_tabDialog.InsertItem(DIALOG_TAB_TALK, L"�����Խ�");
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
	_toolTip.AddTool(GetDlgItem(IDC_TAB1), L"ʹ����ƵSDK�����������ڡ���ʼ���뷴��ʼ�����г�ʼ����ƵSDK���粻��ʹ����ƵSDK���뷴��ʼ��");

	return TRUE;  // ���ǽ��������õ��ؼ������򷵻� TRUE
}

// �����Ի��������С����ť������Ҫ����Ĵ���
//  �����Ƹ�ͼ�ꡣ  ����ʹ���ĵ�/��ͼģ�͵� MFC Ӧ�ó���
//  �⽫�ɿ���Զ���ɡ�

void CDemoDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // ���ڻ��Ƶ��豸������

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// ʹͼ���ڹ����������о���
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// ����ͼ��
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialog::OnPaint();
	}
}

//���û��϶���С������ʱϵͳ���ô˺���ȡ�ù��
//��ʾ��
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
