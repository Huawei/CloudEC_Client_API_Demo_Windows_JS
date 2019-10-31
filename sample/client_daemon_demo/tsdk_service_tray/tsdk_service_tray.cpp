#include <iostream>
#include <stdlib.h>


#include <Windows.h>
#include <WinBase.h>

#include "resource.h"

#include "tsdk_ws_daemon_interface.h"

using namespace std;

#define IDR_PAUSE 12  
#define IDR_START 13
#define IDR_CLOSE 14
/* 
#include <shellapi.h> 
#pragma   comment(lib,   "shell32.lib")  
*/  
LPCTSTR szAppName = TEXT("CloudLink Meeting Daemon");  
LPCTSTR szWndName = TEXT("CloudLink Meeting Daemon");  
HMENU hmenu;//[cn]菜单句柄 [en]Menu handle  
  
LRESULT CALLBACK WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam)  
{  
    static NOTIFYICONDATA nid;  
    UINT WM_TASKBARCREATED;  
    POINT pt;//[cn]用于接收鼠标坐标  [en]Used to receive mouse coordinates
    int xx;//[cn]用于接收菜单选项返回值  [en]This parameter is used to receive the return value of the menu option
  
    // [cn]不要修改TaskbarCreated，这是系统任务栏自定义的消息 [en]Do not modify TaskbarCreated. This is a customized message in the system task bar.  
    WM_TASKBARCREATED = RegisterWindowMessage(TEXT("TaskbarCreated"));  
    switch (message)  
    {  
    case WM_CREATE://[cn]窗口创建时候的消息.   [en]Message displayed when a window is created
        nid.cbSize = sizeof(nid);  
        nid.hWnd = hwnd;  
        nid.uID = 0;  
        nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;  
        nid.uCallbackMessage = WM_USER;  
        nid.hIcon = LoadIcon(GetModuleHandle(NULL), MAKEINTRESOURCE(IDI_ICON1));  
        //lstrcpy(nid.szTip, szAppName);
		strcpy_s(nid.szTip, sizeof(nid.szTip), szAppName);
        Shell_NotifyIcon(NIM_ADD, &nid);  
        hmenu=CreatePopupMenu();//[cn]生成菜单  [en]Generate Menu
		AppendMenu(hmenu,MF_STRING,IDR_CLOSE,"Stop Service"); 
        break;  
    case WM_USER://[cn]连续使用该程序时候的消息.  [en]Message for continuous use of the program
        if (lParam == WM_RBUTTONDOWN)  
        {  
            GetCursorPos(&pt);//[cn]取鼠标坐标  [en]Obtain the coordinates of the mouse
            ::SetForegroundWindow(hwnd);//[cn]解决在菜单外单击左键菜单不消失的问题  [en]Solving the problem that the left mouse button does not disappear after you click the menu
            EnableMenuItem(hmenu,IDR_PAUSE,MF_GRAYED);//[cn]让菜单中的某一项变灰  [en]Turn a certain item in the menu to grey
            xx=TrackPopupMenu(hmenu,TPM_RETURNCMD,pt.x,pt.y,NULL,hwnd,NULL);//[cn]显示菜单并获取选项ID  [en]The menu is displayed and the option ID is obtained
            if(xx==IDR_PAUSE) MessageBox(hwnd, TEXT("111"), szAppName, MB_OK);  
            if(xx==IDR_START) MessageBox(hwnd, TEXT("222"), szAppName, MB_OK);
			if(xx==IDR_CLOSE) SendMessage(hwnd, WM_CLOSE, wParam, lParam);
            if(xx==0) PostMessage(hwnd,WM_LBUTTONDOWN,NULL,NULL);    
        }  
        break;  
    case WM_DESTROY://[cn]窗口销毁时候的消息.  [en]Message when the window is destroyed
        Shell_NotifyIcon(NIM_DELETE, &nid);  
        PostQuitMessage(0);
		xx = WinExec("taskkill /F /IM " TSDK_D_HUAWEI_CLOUD_MEETING_SERVICE_NAME, SW_HIDE);		//lint !e713
        break;  
    default:  
        /* 
        * [cn]防止当Explorer.exe 崩溃以后，程序在系统系统托盘中的图标就消失 
        * [en]When the Explorer.exe breaks down, the icon disappears from the system tray
		*
        * [cn]原理：Explorer.exe 重新载入后会重建系统任务栏。当系统任务栏建立的时候会向系统内所有 
        * 注册接收TaskbarCreated 消息的顶级窗口发送一条消息，我们只需要捕捉这个消息，并重建系 
        * 统托盘的图标即可。 
		* [en]Principle: After the Explorer.exe is reloaded, the system task bar is rebuilt. When 
		* the system task bar is created, the system sends a message to all the top windows that 
		* register and receive TaskbarCreated messages. In this case, you only need to capture 
		* the message and re-create the icon of the system tray.
        */  
        if (message == WM_TASKBARCREATED)  
            SendMessage(hwnd, WM_CREATE, wParam, lParam);  
        break;  
    }  
    return DefWindowProc(hwnd, message, wParam, lParam);  
}  


void ProcessCmdLine(const char* cmdline, TSDK_S_WEB_SOCKET_SERVICE_DAEMON_PARAM *service_daemon_param)
{
    char* portArg = "--ws_port=";
    const char* startPos = strstr(cmdline, portArg);
    if (startPos)
    {
        service_daemon_param->service_port = atoi((startPos + strlen(portArg)));
    }

    string cmdStr = cmdline;
    unsigned int start = cmdStr.find("--log_path=\"");
    if (start != string::npos)
    {
        start += 12;
        unsigned int end = cmdStr.find("\"", start);
        if (end != string::npos)
        {
            string logPath = cmdStr.substr(start, end - start);
            strcpy_s(service_daemon_param->log_path, TSDK_D_MAX_LOG_PATH_LEN + 1, logPath.c_str());
        }
    }

    start = cmdStr.find("--show");
    service_daemon_param->is_show_service_windows = (start != string::npos) ? 1 : 0;

    start = cmdStr.find("--cert_file=\"");
    if (start != string::npos)
    {
        start += 13;
        unsigned int end = cmdStr.find("\"", start);
        if (end != string::npos)
        {
            string cert_filepath = cmdStr.substr(start, end - start);
            strcpy_s(service_daemon_param->cert_file, TSDK_D_MAX_CA_PATH_LEN + 1, cert_filepath.c_str());
        }

    }

    start = cmdStr.find("--key_file=\"");
    if (start != string::npos)
    {
        start += 12;
        unsigned int end = cmdStr.find("\"", start);
        if (end != string::npos)
        {
            string key_filepath = cmdStr.substr(start, end - start);
            strcpy_s(service_daemon_param->key_file, TSDK_D_MAX_CA_PATH_LEN + 1, key_filepath.c_str());
        }

    }
}

  
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance,  
                   LPSTR szCmdLine, int iCmdShow)  
{  
    HWND hwnd;  
    MSG msg;  
    WNDCLASS wndclass;  
  
    HWND handle = FindWindow(NULL, szWndName);  
    if (handle != NULL)  
    {  
        MessageBox(NULL, TEXT("Application is already running"), szAppName, MB_ICONERROR);  
        return 0;  
    }  
  
	msg.wParam = 0;
    wndclass.style = CS_HREDRAW | CS_VREDRAW;  
    wndclass.lpfnWndProc = WndProc;  
    wndclass.cbClsExtra = 0;  
    wndclass.cbWndExtra = 0;  
    wndclass.hInstance = hInstance;  
    wndclass.hIcon = LoadIcon(NULL, IDI_APPLICATION);  
    wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);  
    wndclass.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);  
    wndclass.lpszMenuName = NULL;  
    wndclass.lpszClassName = szAppName;  
  
    if (!RegisterClass(&wndclass))  
    {  
        MessageBox(NULL, TEXT("This program requires Windows NT!"), szAppName, MB_ICONERROR);  
        return 0;  
    }  
  
    // [cn]此处使用WS_EX_TOOLWINDOW 属性来隐藏显示在任务栏上的窗口程序按钮  
	// [en]The WS_EX_TOOLWINDOW property is used to hide the window program buttons displayed on the taskbar
    hwnd = CreateWindowEx(WS_EX_TOOLWINDOW,  
        szAppName, szWndName,  
        WS_POPUP,  
        CW_USEDEFAULT,  
        CW_USEDEFAULT,  
        CW_USEDEFAULT,  
        CW_USEDEFAULT,  
        NULL, NULL, hInstance, NULL);  
  
    ShowWindow(hwnd, iCmdShow);  
    UpdateWindow(hwnd);

    TSDK_S_WEB_SOCKET_SERVICE_DAEMON_PARAM service_daemon_param;
    memset(&service_daemon_param, 0, sizeof(TSDK_S_WEB_SOCKET_SERVICE_DAEMON_PARAM));

    ProcessCmdLine(szCmdLine, &service_daemon_param);

	tsdk_startup_ws_service_deamon(&service_deamon_param);
  
    while (GetMessage(&msg, NULL, 0, 0))  
    {  
        TranslateMessage(&msg);  
        DispatchMessage(&msg);  
    }  
    return msg.wParam;  //lint !e713
}
